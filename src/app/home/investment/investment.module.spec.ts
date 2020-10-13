import { InvestmentModule } from './investment.module';

describe('InvestmentModule', () => {
    let investmentModule: InvestmentModule;

    beforeEach(() => {
        investmentModule = new InvestmentModule();
    });

    it('should create an instance', () => {
        expect(investmentModule).toBeTruthy();
    });
});
