import grpc from 'k6/net/grpc';
export const be_id1 = 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1';
export const be_id2 = 'c2c2c2c2-c2c2-c2c2-c2c2-c2c2c2c2c2c2';
export const cadastral_id = 'b1d1d1d1-d1d1-d1d1-d1d1-d1d1d1d1d1d1';
export const owner_id = 'd3d3d3d3-d3d3-d3d3-d3d3-d3d3d3d3d3d3';
import { check, sleep } from 'k6';

export default class BuildingServiceClient {
  constructor(...protoDirs) {
    this.client = new grpc.Client();
    this.client.load(
      ['../grpc_interface/src/protos', ...protoDirs],
      'buildings.proto'
    );
  }

  connect() {
    this.client.connect(`${__ENV.HOST_NAME || '127.0.0.1'}:8080`, {
      plaintext: true,
    });
  }

  invoke(method, params) {
    const response = this.client.invoke(
      `buildings.BuildingService/${method}`,
      params
    );

    check(
      response,
      {
        'status is OK': (r) => r && r.status === grpc.StatusOK,
        'no runtime error': (r) => !r.error,
      },
      { print: true }
    );

    if (response.error) {
      console.error(response.error);
    }

    return response.message;
  }

  close() {
    this.client.close();
    sleep(1);
  }
}
