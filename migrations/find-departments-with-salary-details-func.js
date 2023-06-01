module.exports = {
  async up({ context: queryInterface }) {
    await queryInterface.sequelize
      .query(`CREATE OR REPLACE FUNCTION find_departments_with_salary_details()
      RETURNS jsonb AS $$
      DECLARE
        result jsonb;
      BEGIN
        WITH employee_data AS (
          SELECT
            e.id,
            e.name,
            e.surname,
            e.department_id,
            (
              SELECT
                JSONB_BUILD_OBJECT(
                  'id', sl.id,
                  'statements', (
                    SELECT
                      JSONB_AGG(
                        JSONB_BUILD_OBJECT(
                          'id', st.id,
                          'amount', st.amount,
                          'date', st.date
                        )
                      )
                    FROM "Statements" st
                    WHERE st.salary_id = sl.id
                  )
                )
              FROM "Salaries" sl
              WHERE sl.employee_id = e.id
            ) AS salary,
            (
              SELECT
                JSONB_AGG(
                  JSONB_BUILD_OBJECT(
                    'id', dn.id,
                    'date', dn.date,
                    'amount', dn.amount
                  )
                )
              FROM "Donations" dn
              WHERE dn.employee_id = e.id
            ) AS donations,
            (
              SELECT MAX(st.amount) - MIN(st.amount)
              FROM "Salaries" sl
              JOIN "Statements" st ON sl.id = st.salary_id
              WHERE sl.employee_id = e.id
            ) AS salary_diff
          FROM "Employees" e
        ),
        employee_data_ordered AS (
          SELECT
            ed.*,
            ROW_NUMBER() OVER (
              PARTITION BY ed.department_id
              ORDER BY ed.salary_diff DESC
            ) AS rn
          FROM employee_data ed
        ),
        max_department_salary_diff AS (
          SELECT
            department_id,
            MAX(salary_diff) AS max_salary_diff
          FROM employee_data
          GROUP BY department_id
        )
        SELECT
          JSONB_AGG(
            JSONB_BUILD_OBJECT(
              'id', d.id,
              'name', d.name,
              'max_salary_diff', mdsd.max_salary_diff,
              'employees', (
                SELECT JSONB_AGG(edo)
                FROM employee_data_ordered edo
                WHERE edo.department_id = d.id AND edo.rn <= 3
              )
            )
          ) INTO result
        FROM "Departments" d
        JOIN max_department_salary_diff mdsd ON d.id = mdsd.department_id
        ORDER BY MAX(mdsd.max_salary_diff) DESC;
        
        RETURN result;
      END;
      $$ LANGUAGE plpgsql;
      `);
  },
  async down({ context: queryInterface }) {
    await queryInterface.sequelize.query(
      'DROP FUNCTION IF EXISTS find_departments_with_salary_details();',
    );
  },
};
