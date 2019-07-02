import { PortfolioDetailsModule } from './portfolio-details.module';

describe('PortfolioDetailsModule', () => {
    let portfolioDetailsModule: PortfolioDetailsModule;

    beforeEach(() => {
        portfolioDetailsModule = new PortfolioDetailsModule();
    });

    it('should create an instance', () => {
        expect(portfolioDetailsModule).toBeTruthy();
    });
});
