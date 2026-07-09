# Phase 3.1: ExpertFlow API Integration - Push Transcriptions to CIM

## 🎯 Objective

After transcription is generated, allow users to **selectively push individual transcription messages** to ExpertFlow's Conversation Information Manager (CIM) API as either Agent or Customer messages.

---

## 📋 Requirements

### **1. Conversation ID Management**
- ✅ Generate unique `CONVERSATION_ID` for each audio file uploaded
- Store conversation ID with the audio file metadata
- Display conversation ID in the UI for reference
- Allow users to manually override/edit conversation ID if needed

### **2. Message Push Button**
- ✅ Add a **"Push to CIM"** button on each transcription message
- Button appears after transcription is generated
- Shows which type the message will be pushed as (Agent/Customer)
- Color-coded: Blue for Agent, Green for Customer

### **3. Message Type Selection**
- ✅ Popup/dropdown to select message sender type when pushing:
  - **Agent Message** - Message from support agent
  - **Customer Message** - Message from customer
- Remember last selected type to reduce clicks
- Show preview of payload before sending

### **4. ExpertFlow API Integration**
- ✅ POST to: `https://missouri.expertflow.com/conversation-manager/customer-topics/{CONVERSATION_ID}/events`
- Send formatted payload based on message type
- Handle API authentication (Bearer token from config)
- Show success/error feedback to user

### **5. Payload Structure**

#### **Agent Message**
```json
{
  "cimEvents": [
    {
      "id": "{{$guid}}",
      "eventEmitter": {
        "id": "869afe42-f7c7-45ab-abfe-d1e5a7f8b56a",
        "type": "AGENT",
        "senderName": "umar01",
        "additionalDetail": {}
      },
      "name": "AGENT_MESSAGE",
      "type": "MESSAGE",
      "timestamp": "{{$isoTimestamp}}",
      "data": {
        "id": "{{$guid}}",
        "header": {
          "conversationId": "{{CONVERSATION_ID}}",
          "sender": {
            "id": "6c412f93-238e-49ed-888d-2c968e5d5244",
            "type": "AGENT",
            "senderName": "{{AGENT_NAME}}"
          }
        },
        "body": {
          "type": "PLAIN",
          "markdownText": "{{TRANSCRIBED_TEXT}}"
        }
      }
    }
  ]
}
```

#### **Customer Message**
```json
{
  "cimEvents": [
    {
      "id": "{{$guid}}",
      "eventEmitter": {
        "tenant": {
          "id": "6a33ca01894afbd07ec89155",
          "type": "CUSTOMER",
          "senderName": "789",
          "additionalDetail": {}
        }
      },
      "name": "CUSTOMER_MESSAGE",
      "type": "MESSAGE",
      "timestamp": "{{$isoTimestamp}}",
      "data": {
        "id": "{{$guid}}",
        "header": {
          "sender": {
            "id": "460df46c-adf9-11ed-afa1-0242ac120002",
            "type": "CONNECTOR",
            "senderName": "WEB_CONNECTOR",
            "additionalDetail": null
          },
          "conversationId": "{{CONVERSATION_ID}}",
          "customer": {
            "_id": "6a4df47b2c10f8250e220217",
            "firstName": "{{CUSTOMER_NAME}}"
          }
        },
        "body": {
          "type": "PLAIN",
          "markdownText": "{{TRANSCRIBED_TEXT}}"
        }
      }
    }
  ]
}
```

---

## 🏗️ Implementation Plan

### **Step 1: Data Models**
```typescript
// conversation.model.ts
export interface Conversation {
  id: string;                    // Unique CONVERSATION_ID
  audioFileId: string;
  createdAt: Date;
  agentName: string;
  agentId: string;
  customerName: string;
  customerId: string;
  expertFlowToken?: string;      // Bearer token
}

export interface TranscriptionMessage {
  id: string;
  speaker: 'agent' | 'customer';
  text: string;
  timestamp: number;
  pushed: boolean;               // Has this been pushed to CIM?
  pushedAt?: Date;
  pushStatus?: 'pending' | 'success' | 'error';
  pushError?: string;
}
```

### **Step 2: Services**

#### **A. Conversation Service**
```typescript
// conversation.service.ts
- generateConversationId(): string         // UUID generator
- updateConversationMetadata()
- getConversationById()
- storeConversationConfig()
```

#### **B. ExpertFlow API Service**
```typescript
// expertflow-api.service.ts
- pushMessageToCIM(
    conversationId: string,
    message: TranscriptionMessage,
    messageType: 'AGENT' | 'CUSTOMER',
    senderInfo: SenderInfo
  ): Observable<ApiResponse>
- generatePayload()
- handleApiResponse()
```

#### **C. Config Service (Enhanced)**
```typescript
// Add to ConfigService:
- expertFlowConfig: {
    apiEndpoint: string,
    bearerToken: string,
    agentId: string,
    agentName: string,
    customerId: string,
    customerName: string
  }
```

### **Step 3: UI Components**

#### **A. Conversation ID Display**
- Show in header/sidebar
- Copy-to-clipboard button
- Edit button for manual override

#### **B. Message Push Button**
- Add to each transcription message in conversation
- Icon: 📤 (upload/send)
- States:
  - **Idle**: Ready to push
  - **Pending**: Sending...
  - **Success**: ✓ Pushed
  - **Error**: ✗ Failed (with retry)

#### **C. Message Type Selector Dialog**
```
┌─────────────────────────────────────┐
│ Select Message Type                 │
├─────────────────────────────────────┤
│ Message: "Hello, how can I help?" │
│                                     │
│ □ Agent (umar01)                   │
│ ☑ Customer (John)                  │
│                                     │
│ [Cancel]          [Push to CIM]    │
└─────────────────────────────────────┘
```

#### **D. ExpertFlow Settings Tab**
- Add 3rd tab in Settings dialog
- Input fields:
  - ExpertFlow API Endpoint
  - Bearer Token / API Key
  - Default Agent ID
  - Default Agent Name
  - Default Customer ID
  - Default Customer Name

### **Step 4: Workflow**

1. **User uploads audio**
   ↓
2. **System generates unique Conversation ID** (show in UI)
   ↓
3. **User transcribes audio**
   ↓
4. **Each transcription message shows with speaker type** (Agent/Customer)
   ↓
5. **User clicks "📤 Push to CIM" on message**
   ↓
6. **Dialog appears asking to confirm sender type**
   ↓
7. **System builds payload with:**
   - Conversation ID
   - Message text
   - Sender info
   - Timestamps
   ↓
8. **POST to ExpertFlow API**
   ↓
9. **Show result:**
   - ✓ Success (green checkmark, button disables)
   - ✗ Error (red, show error message, retry option)

---

## 🔧 Configuration

### **Add to config.json**
```json
{
  "expertflow": {
    "apiEndpoint": "https://missouri.expertflow.com",
    "bearerToken": "",
    "agentId": "",
    "agentName": "",
    "customerId": "",
    "customerName": ""
  }
}
```

### **Add to environment.ts**
```typescript
expertflow: {
  apiEndpoint: 'https://missouri.expertflow.com/conversation-manager/customer-topics',
  bearerToken: '',
  agentId: '',
  agentName: ''
}
```

---

## 📊 File Structure

```
src/app/
├── services/
│   ├── expertflow-api.service.ts          [NEW]
│   ├── conversation.service.ts            [NEW]
│   └── config.service.ts                  [UPDATED]
├── models/
│   ├── conversation.model.ts              [NEW]
│   └── expertflow-payload.model.ts        [NEW]
├── components/
│   ├── conversation/
│   │   └── conversation.component.ts      [UPDATED - add push button]
│   └── api-key-dialog/
│       └── ...component.ts                [UPDATED - add ExpertFlow tab]
└── utils/
    ├── guid-generator.ts                  [NEW]
    └── timestamp-formatter.ts             [NEW]
```

---

## ✅ Success Criteria

- [x] Unique Conversation ID generated per audio file
- [x] Conversation ID displayed in UI
- [x] Push button appears on each transcription message
- [x] Message type selector dialog works
- [x] Payloads formatted correctly
- [x] ExpertFlow API integration working
- [x] Success/error feedback shown
- [x] Tokens/credentials stored securely
- [x] Retry mechanism for failed pushes
- [x] Settings dialog has ExpertFlow config tab

---

## 🎯 Dependencies

### **External APIs**
- ExpertFlow CIM API: `https://missouri.expertflow.com/conversation-manager/customer-topics/{conversationId}/events`
- Authentication: Bearer Token

### **Libraries**
- `uuid` - For generating GUIDs
- Angular HttpClient (already included)

### **Environment**
- ExpertFlow API credentials
- Agent/Customer metadata

---

## 📝 Testing Checklist

- [ ] Test Conversation ID generation (unique, valid format)
- [ ] Test payload generation (Agent message format)
- [ ] Test payload generation (Customer message format)
- [ ] Test API call to ExpertFlow (with mock/real endpoint)
- [ ] Test error handling (network error, invalid token, etc.)
- [ ] Test UI: button states (idle, pending, success, error)
- [ ] Test multiple messages pushed in sequence
- [ ] Test switching between different audio files
- [ ] Test ExpertFlow settings configuration
- [ ] Test browser storage of ExpertFlow credentials

---

## 🚀 Deployment Notes

- Requires ExpertFlow API credentials (token, endpoint)
- CORS might be needed if calling from different domain
- Consider implementing proxy if CORS issues occur
- Add rate limiting to prevent API spam
- Monitor API usage/costs on ExpertFlow side

---

## 📅 Estimated Timeline

| Task | Duration | Priority |
|------|----------|----------|
| Create services | 2-3 hours | High |
| Build UI components | 2 hours | High |
| API integration | 2-3 hours | High |
| Testing | 2 hours | High |
| Documentation | 1 hour | Medium |
| **Total** | **9-10 hours** | - |

---

## 🔐 Security Considerations

✅ **API Credentials**
- Store Bearer token securely (encrypted localStorage or secure cookie)
- Never log credentials
- Option to use environment variables for production

✅ **Data Privacy**
- Conversations are user-specific
- No data logged by default
- Add audit trail for pushed messages

✅ **Error Handling**
- Don't expose internal error details to user
- Log errors server-side for debugging
- Sanitize message content before sending

---

## 🎨 UI Mockup

```
┌─────────────────────────────────────────────────────┐
│ ~ Millie               Thursday, 9 Jul 2026    ⚙️  │
├─────────────────────────────────────────────────────┤
│                                                     │
│ 📁 Uploaded Files: call-2024-07-03.wav             │
│ 🆔 Conversation ID: 6a4e036eb0c4a8cd4d2dc261       │
│                                                     │
│ ─────── Conversation ───────                        │
│                                                     │
│ [12:30 PM] 🤖 Agent                                │
│ "السلام عليكم، كيف حالك؟"                          │
│ [📤 Push to CIM] [✓ Pushed]                        │
│                                                     │
│ [12:31 PM] 👤 Customer                             │
│ "بخير شكراً، لدي مشكلة..."                         │
│ [📤 Push to CIM]                                   │
│                                                     │
│ ─────── QM Analysis ───────                         │
│ Overall Score: 60%                                  │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

**Ready to implement Phase 3.1? Let's build this! 🚀**
