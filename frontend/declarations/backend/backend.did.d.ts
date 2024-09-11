import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface TaxPayer {
  'tid' : bigint,
  'address' : string,
  'lastName' : string,
  'firstName' : string,
}
export interface _SERVICE {
  'createTaxPayer' : ActorMethod<[bigint, string, string, string], boolean>,
  'getAllTaxPayers' : ActorMethod<[], Array<TaxPayer>>,
  'getTaxPayerByTID' : ActorMethod<[bigint], [] | [TaxPayer]>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
