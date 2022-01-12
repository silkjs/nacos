export class Nacos {
  private readonly endpoint: string;
  private readonly _login: () => Promise<string>;
  private call: Promise<string>;
  private readonly access: {
    token: string;
    refresh: number;
    interval: number;
  } = {
    token: "",
    refresh: Date.now(),
    interval: 0,
  };

  constructor(options: {
    endpoint: string;
    username: string;
    password: string;
  }) {
    this.endpoint = options.endpoint;

    const body = new FormData();
    body.set("username", options.username);
    body.set("password", options.password);
    this._login = async () => {
      const response = await fetch(`${this.endpoint}/v1/auth/login`, {
        method: "POST",
        body,
      });
      if (response.status !== 200) {
        console.log(response);
        throw new Error("登录失败");
      }
      const {
        accessToken,
        tokenTtl,
      }: { accessToken: string; tokenTtl: number } = await response.json();
      this.access.refresh = Date.now();
      this.access.token = accessToken;
      this.access.interval = tokenTtl * 60 ** 2;
      return accessToken;
    };
    this.call = this._login();
  }

  async GetConfig<T extends object | string>(options: {
    dataId: string;
    group: string;
    tenant?: string;
  }): Promise<T> {
    const query = new URLSearchParams({
      accessToken: await this.login(),
      ...options,
    });
    const response = await fetch(
      `${this.endpoint}/v1/cs/configs?${query.toString()}`,
      {
        method: "GET",
      }
    );
    if (response.status !== 200) {
      console.log(response);
      throw new Error("配置获取失败");
    }
    return response.headers.get("Content-Type")?.includes("application/json")
      ? response.json()
      : response.text();
  }

  private async login(): Promise<string> {
    await this.call;
    if (this.access.refresh + this.access.interval - Date.now() > 1000) {
      return Promise.resolve(this.access.token);
    }
    this.call = this._login();
    return this.call;
  }
}
