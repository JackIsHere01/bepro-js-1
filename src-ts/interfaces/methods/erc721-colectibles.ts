import {ContractSendMethod} from 'web3-eth-contract';
import {ContractCallMethod} from '@methods/contract-call-method';

export interface ERC721ColectiblesMethods {
  MAX_PURCHASE() :ContractCallMethod<number>;
  _baseFeeAddress() :ContractCallMethod<string>;
  _baseFeeShare() :ContractCallMethod<number>;
  _closed() :ContractCallMethod<boolean>;
  _currentTokenId() :ContractCallMethod<number>;
  _feeAddress() :ContractCallMethod<string>;
  _feeShare() :ContractCallMethod<number>;
  _isLimited() :ContractCallMethod<boolean>;
  _limitedAmount() :ContractCallMethod<number>;
  _openedPacks() :ContractCallMethod<number>;
  _otherAddress() :ContractCallMethod<string>;
  _otherShare() :ContractCallMethod<number>;
  _pricePerPack() :ContractCallMethod<number>;
  _purchaseToken() :ContractCallMethod<string>;
  alreadyMinted(v1: number) :ContractCallMethod<boolean>;
  approve(to: string, tokenId: number) :ContractSendMethod;
  balanceOf(owner: string) :ContractCallMethod<number>;
  baseURI() :ContractCallMethod<string>;
  getApproved(tokenId: number) :ContractCallMethod<string>;
  isApprovedForAll(owner: string, operator: string) :ContractCallMethod<boolean>;
  lock() :ContractSendMethod;
  name() :ContractCallMethod<string>;
  owner() :ContractCallMethod<string>;
  ownerOf(tokenId: number) :ContractCallMethod<string>;
  registeredIDs(v1: string, v2: number) :ContractCallMethod<boolean>;
  registeredIDsArray(v1: string, v2: number) :ContractCallMethod<number>;
  safeTransferFrom(from: string, to: string, tokenId: number) :ContractSendMethod;
  safeTransferFrom(from: string, to: string, tokenId: number, _data?: string) :ContractSendMethod;
  setApprovalForAll(operator: string, approved: boolean) :ContractSendMethod;
  setFeeAddress(feeAddress: string) :ContractSendMethod;
  setOtherAddress(otherAddress: string) :ContractSendMethod;
  setPricePerPack(newPrice: number) :ContractSendMethod;
  setPurchaseTokenAddress(purchaseToken: string) :ContractSendMethod;
  setShares(feeShare: number, otherShare: number) :ContractSendMethod;
  supportsInterface(interfaceId: string) :ContractCallMethod<boolean>;
  symbol() :ContractCallMethod<string>;
  tokenByIndex(index: number) :ContractCallMethod<number>;
  tokenOfOwnerByIndex(owner: string, index: number) :ContractCallMethod<number>;
  tokenURI(tokenId: number) :ContractCallMethod<string>;
  totalSupply() :ContractCallMethod<number>;
  transferFrom(from: string, to: string, tokenId: number) :ContractSendMethod;
  transferOwnership(newOwner: string) :ContractSendMethod;
  unlock() :ContractSendMethod;
  exists(tokenId: number) :ContractCallMethod<boolean>;
  setTokenURI(tokenId: number, uri: string) :ContractSendMethod;
  setBaseURI(baseURI: string) :ContractSendMethod;
  mint(tokenIdToMint: number) :ContractSendMethod;
  openPack(amount: number) :ContractSendMethod;
  getRegisteredIDs(_address: string) :ContractCallMethod<number[]>;
}
