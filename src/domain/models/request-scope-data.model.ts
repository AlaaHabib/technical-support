import { AsyncLocalStorage } from 'async_hooks';
export class RequestScopeData<TId = any, TEmail = string , TRole = string> {
  static cls = new AsyncLocalStorage<RequestScopeData>();
  constructor(public readonly id: TId, public readonly email: TEmail, public readonly role:TRole) {}
  static get currentContext() {
    return this.cls.getStore();
  }
}
