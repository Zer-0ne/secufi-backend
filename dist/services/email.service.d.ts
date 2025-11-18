interface EmailOptions {
    to: string | string[];
    subject: string;
    text?: string;
    html?: string;
    cc?: string | string[];
    bcc?: string | string[];
}
interface InvitationEmailData {
    recipientName: string;
    inviterName: string;
    familyName: string;
    role: string;
    acceptLink: string;
}
declare class EmailService {
    private transporter;
    constructor();
    sendEmail(options: EmailOptions): Promise<boolean>;
    sendFamilyInvitation(data: InvitationEmailData): Promise<boolean>;
    private createInvitationTemplate;
    private createInvitationTextTemplate;
    verifyConnection(): Promise<boolean>;
}
declare const _default: EmailService;
export default _default;
//# sourceMappingURL=email.service.d.ts.map