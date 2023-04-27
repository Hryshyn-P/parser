import { Injectable, OnApplicationBootstrap } from '@nestjs/common';

@Injectable()
export class AppBootstrapService implements OnApplicationBootstrap {
  async onApplicationBootstrap(): Promise<void> {
    console.log('Application started');
    //........
  }
}
