export class Nacos {
  private readonly endpoint: string;
  private readonly namespace: string;
  private readonly username: string;
  private readonly password: string;
  constructor(options: {
    endpoint: string;
    namespace: string;
    username: string;
    password: string;
  }) {
    this.endpoint = options.endpoint;
    this.namespace = options.namespace;
    this.username = options.username;
    this.password = options.password;
  }

  async GetConfig<T extends object>(dataId: string, group: string): Promise<T> {
    const token = await this.login();
    const response = await fetch(
      `${this.endpoint}/v1/cs/configs?accessToken=${token}&tenant=${this.namespace}&dataId=${dataId}&group=${group}`,
      {
        method: "GET",
      }
    );
    if (response.status !== 200) {
      console.log(response);
      throw new Error("获取失败");
    }

    return response.json();
  }

  private async login(): Promise<string> {
    const body = new FormData();
    body.set("username", this.username);
    body.set("password", this.password);
    const response = await fetch(`${this.endpoint}/v1/auth/login`, {
      method: "POST",
      body,
    });
    if (response.status !== 200) {
      console.log(response);
      throw new Error("登录失败");
    }
    return response.json().then(({ accessToken }) => accessToken);
  }
}
