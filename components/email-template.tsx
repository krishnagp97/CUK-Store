
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

type VerifyEmailProps = {
  verificationUrl: string;
  userName?: string;
};

export default function EmailTemplate({
  verificationUrl,
  userName,
}: VerifyEmailProps) {
  return (
    <Html>
      <Head />

      <Preview>Verify your CUK Store account</Preview>

      <Body
        style={{
          backgroundColor: "#f4f4f5",
          fontFamily: "Arial, sans-serif",
          margin: 0,
          padding: 0,
        }}
      >
        <Container
          style={{
            backgroundColor: "#ffffff",
            margin: "40px auto",
            padding: "40px",
            borderRadius: "12px",
            maxWidth: "600px",
          }}
        >
          <Heading
            style={{
              textAlign: "center",
              color: "#2563eb",
              fontSize: "28px",
              marginBottom: "30px",
            }}
          >
            CUK Store
          </Heading>

          <Text
            style={{
              fontSize: "16px",
              color: "#111827",
            }}
          >
            Hello{userName ? ` ${userName}` : ""},
          </Text>

          <Text
            style={{
              fontSize: "15px",
              lineHeight: "1.6",
              color: "#374151",
            }}
          >
            Thanks for creating your CUK Store account. Please verify your
            email address to activate your account and start buying and
            selling on the campus marketplace.
          </Text>

          <Section
            style={{
              textAlign: "center",
              margin: "32px 0",
            }}
          >
            <Button
              href={verificationUrl}
              style={{
                backgroundColor: "#2563eb",
                color: "#ffffff",
                padding: "14px 28px",
                borderRadius: "8px",
                textDecoration: "none",
                fontSize: "15px",
                fontWeight: "600",
              }}
            >
              Verify My Email
            </Button>
          </Section>

          <Text
            style={{
              fontSize: "14px",
              color: "#666666",
              lineHeight: "1.6",
            }}
          >
            This verification link will expire in 1 hour.
          </Text>

          <Hr
            style={{
              borderColor: "#e5e7eb",
              margin: "30px 0",
            }}
          />

          <Text
            style={{
              fontSize: "14px",
              color: "#666666",
              lineHeight: "1.6",
            }}
          >
            If you didn't create this account, you can safely ignore this
            email.
          </Text>

          <Text
            style={{
              fontSize: "12px",
              color: "#999999",
              textAlign: "center",
              marginTop: "30px",
            }}
          >
            © {new Date().getFullYear()} CUK Store
            <br />
            Campus Marketplace
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
