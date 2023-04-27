export class Department {
  id: number;
  name: string;
  employees: Employee[];

  constructor() {
    this.employees = [];
  }
}

export class Employee {
  id: number;
  name: string;
  surname: string;
  donations: Donation[];
  department: Department;
  salary: Salary;
}

export class Statement {
  id: number;
  amount: number;
  date: Date;
}

export class Salary extends Statement {
  statements: Statement[];

  constructor() {
    super();
    this.statements = [];
  }
}

export class Donation {
  id: number;
  date: Date;
  amount: number;
}

export class Rate {
  date: Date;
  sign: string;
  value: number;
}
