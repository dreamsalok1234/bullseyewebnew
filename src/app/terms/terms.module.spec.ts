import { TermsModule } from './terms.module';

describe('LoginModule', () => {
    let termsModule: TermsModule;

    beforeEach(() => {
        termsModule = new TermsModule();
    });

    it('should create an instance', () => {
        expect(termsModule).toBeTruthy();
    });
});
