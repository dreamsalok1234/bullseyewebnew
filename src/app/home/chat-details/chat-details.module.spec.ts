import { ChatDetailsModule } from './chat-details.module';

describe('ChatDetailsModule', () => {
    let chatDetailsModule: ChatDetailsModule;

    beforeEach(() => {
        chatDetailsModule = new ChatDetailsModule();
    });

    it('should create an instance', () => {
        expect(chatDetailsModule).toBeTruthy();
    });
});
