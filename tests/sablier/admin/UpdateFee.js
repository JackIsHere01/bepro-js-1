import BigNumber from 'bignumber.js';
import { dappConstants } from '../../../src/sablier/dev-utils';
import beproAssert from '../../../build/utils/beproAssert';
import sablierUtils from '../sablier.utils';

const { STANDARD_SABLIER_FEE } = dappConstants;

context('sablier.UpdateFee.context', () => {
  let admin;// = _this.alice;

  before('sablier.UpdateFee.before', async () => {
    await sablierUtils.initConfig();
    admin = _this.alice;
  });

  describe('when the caller is the admin', () => {
    // const opts = { from: admin };

    describe('when the fee is a valid percentage', () => {
      const newFee = STANDARD_SABLIER_FEE;

      it('updates the fee', async () => {
        _this.sablier.switchWallet(admin);
        await _this.sablier.updateFee({ feePercentage: newFee });
        const result = await _this.sablier.fee();
        // The new fee is a mantissa
        result.should.be.bignumber.equal(newFee);
      });
    });

    describe('when the fee is not a valid percentage', () => {
      it('reverts', async () => {
        _this.sablier.switchWallet(admin);
        const newFee = new BigNumber(110);
        await beproAssert.reverts(
          () => _this.sablier.updateFee({ feePercentage: newFee }),
          'fee percentage higher than 100%',
        );
      });
    });
  });

  describe('when the caller is not the admin', async () => {
    // const opts = { from: eve };
    const newFee = STANDARD_SABLIER_FEE;

    it('reverts', async () => {
      _this.sablier.switchWallet(_this.eve);
      await beproAssert.reverts(
        () => _this.sablier.updateFee({ feePercentage: newFee }),
        beproAssert.ErrorType.REVERT,
      );
    });
  });
});
