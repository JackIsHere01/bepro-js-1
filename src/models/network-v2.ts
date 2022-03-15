import {Model} from '@base/model';
import {Web3Connection} from '@base/web3-connection';
import {Web3ConnectionOptions} from '@interfaces/web3-connection-options';
import {Deployable} from '@interfaces/deployable';
import Network_v2Json from '@abi/Network_v2.json';
import {Network_v2Methods} from '@methods/network-v2';
import * as Events from '@events/network-v2-events';
import {XEvents} from '@events/x-events';
import {PastEventOptions} from 'web3-eth-contract';
import {AbiItem} from 'web3-utils';
import {BountyToken} from '@models/bounty-token';
import {ERC20} from '@models/erc20';
import {Governed} from '@base/governed';
import {toSmartContractDecimals} from '@utils/numbers';
import {nativeZeroAddress} from '@utils/constants';

export class Network_v2 extends Model<Network_v2Methods> implements Deployable {
  constructor(web3Connection: Web3Connection|Web3ConnectionOptions, contractAddress?: string) {
    super(web3Connection, (Network_v2Json as any).abi as AbiItem[], contractAddress);
  }

  private _nftToken!: BountyToken;
  private _settlerToken!: ERC20;
  private _governed!: Governed;

  get nftToken() { return this._nftToken; }

  /**
   * Settler token is the token that originates oracles
   */
  get settlerToken() { return this._settlerToken; }

  /**
   * Access Governed contract functions through here
   */
  get governed() { return this._governed; }

  async start() {
    await super.start();
    await this.loadContract();
  }

  async loadContract() {
    if (!this.contract)
      await super.loadContract();

    const nftAddress = await this.nftTokenAddress();
    const transactionalTokenAddress = await this.settlerTokenAddress();

    this._nftToken = new BountyToken(this.web3Connection, nftAddress);
    this._settlerToken = new ERC20(this.web3Connection, transactionalTokenAddress);

    this._governed = new Governed(this);

    await this._nftToken.loadContract();
    await this._settlerToken.loadContract();

  }

  async deployJsonAbi(_settlerToken: string, _bountyTokenName: string, _bountyTokenSymbol: string, _bountyNftUri: string) {
    const deployOptions = {
        data: (Network_v2Json as any).bytecode,
        arguments: [_settlerToken, _bountyTokenName, _bountyTokenSymbol, _bountyNftUri]
    };

    return this.deploy(deployOptions, this.web3Connection.Account);
  }

  async bountyNftUri() {
    return this.callTx(this.contract.methods.bountyNftUri());
  }

  async canceledBounties() {
    return this.callTx(this.contract.methods.canceledBounties());
  }

  async closedBounties() {
    return this.callTx(this.contract.methods.closedBounties());
  }

  async councilAmount() {
    return this.callTx(this.contract.methods.councilAmount());
  }

  async disputableTime() {
    return this.callTx(this.contract.methods.disputableTime());
  }

  async draftTime() {
    return this.callTx(this.contract.methods.draftTime());
  }

  async mergeCreatorFeeShare() {
    return this.callTx(this.contract.methods.mergeCreatorFeeShare());
  }

  async nftTokenAddress() {
    return this.callTx(this.contract.methods.nftToken());
  }

  async oracleExchangeRate() {
    return this.callTx(this.contract.methods.oracleExchangeRate());
  }

  async oraclesDistributed() {
    return this.callTx(this.contract.methods.oraclesDistributed());
  }

  async oraclesStaked() {
    return this.callTx(this.contract.methods.oraclesStaked());
  }

  async percentageNeededForDispute() {
    return this.callTx(this.contract.methods.percentageNeededForDispute());
  }

  async settlerTokenAddress() {
    return this.callTx(this.contract.methods.settlerToken());
  }

  async proposerFeeShare() {
    return this.callTx(this.contract.methods.proposerFeeShare());
  }

  async totalSettlerLocked() {
    return this.callTx(this.contract.methods.totalSettlerLocked());
  }

  async totalStaked() {
    return this.callTx(this.contract.methods.totalStaked());
  }

  async unlockPeriod() {
    return this.callTx(this.contract.methods.unlockPeriod());
  }

  async getBountiesOfAddress(_address: string) {
    return this.callTx(this.contract.methods.getBountiesOfAddress(_address));
  }

  async getBounty(id: number) {
    return this.callTx(this.contract.methods.getBounty(id));
  }

  async getBounties(ids: number) {
    return this.callTx(this.contract.methods.getBounties(ids));
  }

  async getPullRequest(bountyId: number, pullRequestId: number) {
    return this.callTx(this.contract.methods.getPullRequest(bountyId, pullRequestId));
  }

  async getProposal(bountyId: number, proposalId: number) {
    return this.callTx(this.contract.methods.getProposal(bountyId, proposalId));
  }

  async changeCouncilAmount(newAmount: number) {
    newAmount = toSmartContractDecimals(newAmount, this.settlerToken.decimals) as number;
    return this.sendTx(this.contract.methods.changeCouncilAmount(newAmount));
  }

  /**
   * @param _draftTime duration in seconds
   */
  async changeDraftTime(_draftTime: number) {
    return this.sendTx(this.contract.methods.changeDraftTime(_draftTime));
  }

  /**
   * @param _disputableTime duration in seconds
   */
  async changeDisputableTime(_disputableTime: number) {
    return this.sendTx(this.contract.methods.changeDisputableTime(_disputableTime));
  }

  async changePercentageNeededForDispute(_percentageNeededForDispute: number) {
    return this.sendTx(this.contract.methods.changePercentageNeededForDispute(_percentageNeededForDispute));
  }

  async changeMergeCreatorFeeShare(_mergeCreatorFeeShare: number) {
    return this.sendTx(this.contract.methods.changeMergeCreatorFeeShare(_mergeCreatorFeeShare));
  }

  async changeOracleExchangeRate(_oracleExchangeRate: number) {
    return this.sendTx(this.contract.methods.changeOracleExchangeRate(_oracleExchangeRate));
  }

  /**
   * returns true if NOW is less than bounty create time plus draft time
   */
  async isBountyInDraft(id: number) {
    return this.callTx(this.contract.methods.isBountyInDraft(id));
  }

  async isBountyFundingRequest(id: number) {
    return this.callTx(this.contract.methods.isBountyFundingRequest(id));
  }

  async isBountyFunded(id: number) {
    return this.callTx(this.contract.methods.isBountyFunded(id));
  }

  /**
   * returns true if NOW is less than proposal create time plus disputable time
   */
  async isProposalInDraft(bountyId: number, proposalId: number) {
    return this.callTx(this.contract.methods.isProposalInDraft(bountyId, proposalId));
  }

  /**
   * returns true if disputes on proposal is higher than the percentage of the total oracles staked
   */
  async isProposalDisputed(bountyId: number, proposalId: number) {
    return this.callTx(this.contract.methods.isProposalDisputed(bountyId, proposalId));
  }

  async isProposalRefused(bountyId: number, proposalId: number) {
    return this.callTx(this.contract.methods.isProposalRefused(bountyId, proposalId));
  }

  async isAfterUnlockPeriod(date: number) {
    return this.callTx(this.contract.methods.isAfterUnlockPeriod(date));
  }

  /**
   * get total amount of oracles of an address
   */
  async getOraclesOf(_address: string) {
    return this.callTx(this.contract.methods.getOraclesOf(_address));
  }

  async getOracleExchangeRate() {
    return this.callTx(this.contract.methods.getOracleExchangeRate());
  }

  async calculatePercentPerTenK(amount: number) {
    return this.callTx(this.contract.methods.calculatePercentPerTenK(amount));
  }

  async calculateOracleExchangeRate(settlerAmount: number) {
    return this.callTx(this.contract.methods.calculateOracleExchangeRate(settlerAmount));
  }

  async calculateSettlerExchangeRate(oraclesAmount: number) {
    return this.callTx(this.contract.methods.calculateSettlerExchangeRate(oraclesAmount));
  }

  /**
   * Lock given amount into the oracle mapping
   */
  async lock(tokenAmount: number) {
    return this.sendTx(this.contract.methods.lock(tokenAmount));
  }

  /**
   * Unlock from the oracle mapping
   */
  async unlock(tokenAmount: number, from: string) {
    return this.sendTx(this.contract.methods.unlock(tokenAmount, from));
  }

  /**
   * Gives oracles from msg.sender to recipient
   */
  async delegateOracles(tokenAmount: number, recipient: string) {
    return this.sendTx(this.contract.methods.delegateOracles(tokenAmount, recipient));
  }

  /**
   * Creates a bounty on the network
   * You can open a funding-request-bounty by providing `rewardToken`, `rewardAmount`, and `fundingAmount`
   *
   * @param {number} [tokenAmount=0] the value of this bounty (ignored if funding)
   * @param {string} [transactional=0x0000000000000000000000000000000000000000] the token address of the ERC20 used for paying for this bounty
   * @param {string} [rewardToken=0x0000000000000000000000000000000000000000] reward token address in case of funding
   * @param {number} [rewardAmount=0] reward amount in case of funding; this value will be shared by all benefactors based on their percentage of funding and chosen ratio
   * @param {number} [fundingAmount=0] requested funding amount (in transactional ERC20)
   * @param {string} cid custom id of this bounty
   * @param {string} title title for this bounty
   * @param {string} repoPath repository path for this bounty
   * @param {string} branch branch inside the provided repo path
   */
  async openBounty(tokenAmount: number = 0,
                   transactional: string = nativeZeroAddress,
                   rewardToken: string = nativeZeroAddress,
                   rewardAmount: number = 0,
                   fundingAmount: number = 0,
                   cid: string,
                   title: string,
                   repoPath: string,
                   branch: string) {

    let _rewardAmount = 0;
    let _fundingAmount = 0;

    const _transactional = new ERC20(this.web3Connection, transactional);
    await _transactional.loadContract();
    const _tokenAmount = toSmartContractDecimals(tokenAmount, _transactional.decimals) as number;

    if (rewardAmount && rewardToken !== nativeZeroAddress) {
      const rewardERC20 = new ERC20(this.web3Connection, rewardToken);
      await rewardERC20.loadContract();
      _rewardAmount = toSmartContractDecimals(rewardAmount, rewardERC20.decimals) as number;
      _fundingAmount = toSmartContractDecimals(fundingAmount, _transactional.decimals) as number;
    }

    return this.sendTx(
      this.contract.methods.openBounty(_tokenAmount,
                                       transactional,
                                       rewardToken,
                                       _rewardAmount,
                                       _fundingAmount,
                                       cid,
                                       title,
                                       repoPath,
                                       branch));
  }

  /**
   * user adds value to an existing bounty
   * @param id bounty id
   * @param tokenAmount amount to add as support
   * @param decimals decimals of the transactional for this bounty
   */
  async supportBounty(id: number, tokenAmount: number, decimals = 18) {
    tokenAmount = toSmartContractDecimals(tokenAmount, decimals) as number;
    return this.sendTx(this.contract.methods.supportBounty(id, tokenAmount));
  }

  /**
   * user removes its beneficiary entry
   * @param bountyId
   * @param entryId
   */
  async retractSupportFromBounty(bountyId: number, entryId: number) {
    return this.sendTx(this.contract.methods.retractSupportFromBounty(bountyId, entryId));
  }

  /**
   * cancel a bounty
   */
  async cancelBounty(id: number) {
    return this.sendTx(this.contract.methods.cancelBounty(id));
  }

  /**
   * cancel funding
   */
  async cancelFundRequest(id: number) {
    return this.sendTx(this.contract.methods.cancelFundRequest(id));
  }

  /**
   * update the value of a bounty with a new amount
   * @param {number} id
   * @param {number} newTokenAmount
   * @param {number} decimals decimals of the transactional for this bounty
   */
  async updateBountyAmount(id: number, newTokenAmount: number, decimals = 18) {
    newTokenAmount = toSmartContractDecimals(newTokenAmount, decimals) as number;
    return this.sendTx(this.contract.methods.updateBountyAmount(id, newTokenAmount));
  }

  /**
   * enable users to fund a bounty
   * @param {number} id
   * @param {number} fundingAmount
   * @param {number} decimals decimals of the transactional for this bounty
   */
  async fundBounty(id: number, fundingAmount: number, decimals = 18) {
    fundingAmount = toSmartContractDecimals(fundingAmount, decimals) as number;
    return this.sendTx(this.contract.methods.fundBounty(id, fundingAmount));
  }

  /**
   * enable users to retract their funding
   */
  async retractFunds(id: number, fundingIds: number) {
    return this.sendTx(this.contract.methods.retractFunds(id, fundingIds));
  }

  /**
   * create pull request for bounty id
   */
  async createPullRequest(forBountyId: number, originRepo: string, originBranch: string, originCID: string, userRepo: string, userBranch: string, cid: number) {
    return this.sendTx(this.contract.methods.createPullRequest(forBountyId, originRepo, originBranch, originCID, userRepo, userBranch, cid));
  }

  async cancelPullRequest(ofBounty: number, prId: number) {
    return this.sendTx(this.contract.methods.cancelPullRequest(ofBounty, prId));
  }

  /**
   * mark a PR ready for review
   */
  async markPullRequestReadyForReview(bountyId: number, pullRequestId: number) {
    return this.sendTx(this.contract.methods.markPullRequestReadyForReview(bountyId, pullRequestId));
  }

  /**
   * create a proposal with a pull request for a bounty
   */
  async createBountyProposal(id: number, prId: number, recipients: string[], percentages: number[]) {
    return this.sendTx(this.contract.methods.createBountyProposal(id, prId, recipients, percentages));
  }

  /**
   * dispute a proposal for a bounty
   */
  async disputeBountyProposal(bountyId: number, proposalId: number) {
    return this.sendTx(this.contract.methods.disputeBountyProposal(bountyId, proposalId));
  }

  async refuseBountyProposal(bountyId: number, proposalId: number) {
    return this.sendTx(this.contract.methods.refuseBountyProposal(bountyId, proposalId));
  }

  /**
   * close bounty with the selected proposal id
   */
  async closeBounty(id: number, proposalId: number) {
    return this.sendTx(this.contract.methods.closeBounty(id, proposalId));
  }

  async cidBountyId(cid: string) {
    return this.callTx(this.contract.methods.cidBountyId(cid));
  }

  async bountiesOfAddress(address: string) {
    return this.callTx(this.contract.methods.bountiesOfAddress(address));
  }

  async getBountyCanceledEvents(filter: PastEventOptions): Promise<XEvents<Events.BountyCanceledEvent>[]> {
    return this.contract.self.getPastEvents(`BountyCanceled`, filter)
  }

  async getBountyClosedEvents(filter: PastEventOptions): Promise<XEvents<Events.BountyClosedEvent>[]> {
    return this.contract.self.getPastEvents(`BountyClosed`, filter)
  }

  async getBountyCreatedEvents(filter: PastEventOptions): Promise<XEvents<Events.BountyCreatedEvent>[]> {
    return this.contract.self.getPastEvents(`BountyCreated`, filter)
  }

  async getBountyDistributedEvents(filter: PastEventOptions): Promise<XEvents<Events.BountyDistributedEvent>[]> {
    return this.contract.self.getPastEvents(`BountyDistributed`, filter)
  }

  async getBountyProposalCreatedEvents(filter: PastEventOptions): Promise<XEvents<Events.BountyProposalCreatedEvent>[]> {
    return this.contract.self.getPastEvents(`BountyProposalCreated`, filter)
  }

  async getBountyProposalDisputedEvents(filter: PastEventOptions): Promise<XEvents<Events.BountyProposalDisputedEvent>[]> {
    return this.contract.self.getPastEvents(`BountyProposalDisputed`, filter)
  }

  async getBountyProposalRefusedEvents(filter: PastEventOptions): Promise<XEvents<Events.BountyProposalRefusedEvent>[]> {
    return this.contract.self.getPastEvents(`BountyProposalRefused`, filter)
  }

  async getBountyPullRequestCanceledEvents(filter: PastEventOptions): Promise<XEvents<Events.BountyPullRequestCanceledEvent>[]> {
    return this.contract.self.getPastEvents(`BountyPullRequestCanceled`, filter)
  }

  async getBountyPullRequestCreatedEvents(filter: PastEventOptions): Promise<XEvents<Events.BountyPullRequestCreatedEvent>[]> {
    return this.contract.self.getPastEvents(`BountyPullRequestCreated`, filter)
  }

  async getBountyPullRequestReadyForReviewEvents(filter: PastEventOptions): Promise<XEvents<Events.BountyPullRequestReadyForReviewEvent>[]> {
    return this.contract.self.getPastEvents(`BountyPullRequestReadyForReview`, filter)
  }

  async getGovernorTransferredEvents(filter: PastEventOptions): Promise<XEvents<Events.GovernorTransferredEvent>[]> {
    return this.contract.self.getPastEvents(`GovernorTransferred`, filter)
  }

}
