const { parentPort } = require('worker_threads');
const handlebars = require('handlebars');

class DmcaAgent {
  constructor() {
    this.templates = {
      standard: this.getStandardTemplate(),
      detailed: this.getDetailedTemplate(),
      urgent: this.getUrgentTemplate(),
    };

    this.platformContacts = {
      'google': {
        email: 'copyright@google.com',
        form: 'https://www.google.com/dmca.html',
        name: 'Google LLC',
      },
      'bing': {
        email: 'dmca@microsoft.com',
        form: 'https://www.microsoft.com/en-us/legal/intellectualproperty/infringement',
        name: 'Microsoft Corporation',
      },
      'facebook': {
        email: 'ip@meta.com',
        form: 'https://www.facebook.com/help/contact/1758255661104383',
        name: 'Meta Platforms, Inc.',
      },
      'instagram': {
        email: 'ip@meta.com',
        form: 'https://help.instagram.com/454951664593304',
        name: 'Meta Platforms, Inc.',
      },
      'youtube': {
        email: 'copyright@youtube.com',
        form: 'https://www.youtube.com/copyright_complaint_form',
        name: 'YouTube LLC',
      },
      'twitter': {
        email: 'copyright@twitter.com',
        form: 'https://help.twitter.com/forms/dmca',
        name: 'Twitter, Inc.',
      },
    };
  }

  getStandardTemplate() {
    return `
Subject: DMCA Takedown Notice - {{contentTitle}}

Dear {{platformName}} DMCA Agent,

I am writing to notify you of copyright infringement occurring on your platform. This notice is submitted under the Digital Millennium Copyright Act (DMCA), 17 U.S.C. § 512.

**1. IDENTIFICATION OF COPYRIGHTED WORK:**
Title: {{contentTitle}}
Description: {{contentDescription}}
Original Location: {{originalUrl}}
Copyright Owner: {{ownerName}}
Creation Date: {{creationDate}}

**2. IDENTIFICATION OF INFRINGING MATERIAL:**
Infringing URL: {{infringingUrl}}
Platform: {{platformName}}
Description of Infringement: {{infringementDescription}}
Date Discovered: {{discoveryDate}}

**3. CONTACT INFORMATION:**
Name: {{ownerName}}
Email: {{ownerEmail}}
Phone: {{ownerPhone}}
Address: {{ownerAddress}}

**4. GOOD FAITH STATEMENT:**
I have a good faith belief that use of the copyrighted material described above is not authorized by the copyright owner, its agent, or the law.

**5. ACCURACY STATEMENT:**
I swear, under penalty of perjury, that the information in this notification is accurate and that I am the copyright owner or am authorized to act on behalf of the copyright owner.

**6. ELECTRONIC SIGNATURE:**
/s/ {{ownerName}}
Date: {{currentDate}}

Sincerely,
{{ownerName}}
{{ownerTitle}}

---
This notice is submitted in good faith and in accordance with the DMCA. Please remove or disable access to the infringing material expeditiously.
    `.trim();
  }

  getDetailedTemplate() {
    return `
Subject: Formal DMCA Takedown Notice - Unauthorized Use of Copyrighted Material

To Whom It May Concern:

This is a formal DMCA takedown notice pursuant to 17 U.S.C. § 512(c)(3)(A). I am the copyright owner of the work described below and request immediate removal of infringing content.

**COPYRIGHTED WORK IDENTIFICATION:**
• Work Title: {{contentTitle}}
• Work Type: {{contentType}}
• Copyright Registration: {{registrationNumber}}
• Publication Date: {{publicationDate}}
• Original Source: {{originalUrl}}
• Rights Holder: {{ownerName}}

**INFRINGING MATERIAL DETAILS:**
• Infringing URL: {{infringingUrl}}
• Platform: {{platformName}}
• Uploader/Account: {{uploaderInfo}}
• Upload Date: {{uploadDate}}
• Nature of Infringement: {{infringementType}}

**EVIDENCE OF OWNERSHIP:**
{{evidenceDescription}}

**CONTACT INFORMATION:**
Legal Name: {{ownerName}}
Business Name: {{businessName}}
Email Address: {{ownerEmail}}
Telephone: {{ownerPhone}}
Mailing Address: {{ownerAddress}}

**DMCA STATEMENTS:**
I have a good faith belief that the use of the material in the manner complained of is not authorized by the copyright owner, its agent, or the law.

I swear, under penalty of perjury, that the information in this notification is accurate and that I am the copyright owner, or am authorized to act on behalf of the owner, of an exclusive right that is allegedly infringed.

**SIGNATURE:**
Electronic Signature: /s/ {{ownerName}}
Date: {{currentDate}}
Title: {{ownerTitle}}

**REQUEST FOR RESPONSE:**
Please confirm receipt of this notice and provide details of the action taken. Under the DMCA, you are required to expeditiously remove or disable access to the infringing material.

Best regards,
{{ownerName}}
    `.trim();
  }

  getUrgentTemplate() {
    return `
Subject: URGENT - DMCA Takedown Notice - Immediate Action Required

URGENT DMCA TAKEDOWN NOTICE

Dear {{platformName}} Legal Team,

This is an urgent DMCA takedown notice requiring immediate attention due to ongoing copyright infringement causing significant harm to my business.

**IMMEDIATE REMOVAL REQUESTED FOR:**
URL: {{infringingUrl}}
Content: {{contentTitle}}
Infringement Type: {{urgencyReason}}

**COPYRIGHT OWNER:**
{{ownerName}} - {{ownerTitle}}
Contact: {{ownerEmail}} | {{ownerPhone}}

**WORK BEING INFRINGED:**
Original Work: {{contentTitle}}
Copyright Date: {{creationDate}}
Original Location: {{originalUrl}}

**HARM BEING CAUSED:**
{{harmDescription}}

**DMCA COMPLIANCE STATEMENTS:**
✓ Good faith belief statement included
✓ Accuracy under penalty of perjury confirmed
✓ Authorization to act on behalf of copyright owner verified

**ELECTRONIC SIGNATURE:**
/s/ {{ownerName}}
Date: {{currentDate}}

**REQUIRED ACTION:**
Please remove or disable access to the infringing material immediately and confirm removal within 24 hours.

Thank you for your urgent attention to this matter.

{{ownerName}}
{{ownerEmail}}
    `.trim();
  }

  generateDmcaNotice(infringement, ownerInfo, template = 'standard') {
    try {
      const templateContent = this.templates[template];
      const compiledTemplate = handlebars.compile(templateContent);

      const platformInfo = this.platformContacts[infringement.platform.toLowerCase()] || {
        email: 'legal@platform.com',
        name: infringement.platform,
      };

      const data = {
        // Content information
        contentTitle: infringement.contentTitle || 'Protected Creative Work',
        contentDescription: infringement.contentDescription || 'Original creative content',
        contentType: infringement.contentType || 'Digital Media',
        originalUrl: infringement.originalUrl || '',
        
        // Infringement details
        infringingUrl: infringement.url,
        platformName: platformInfo.name,
        infringementDescription: infringement.description || 'Unauthorized reproduction and distribution',
        infringementType: this.determineInfringementType(infringement),
        discoveryDate: new Date().toLocaleDateString(),
        uploadDate: infringement.uploadDate || 'Unknown',
        uploaderInfo: infringement.uploaderInfo || 'Unknown user',
        
        // Owner information
        ownerName: ownerInfo.name || 'Content Owner',
        ownerEmail: ownerInfo.email || 'owner@example.com',
        ownerPhone: ownerInfo.phone || '',
        ownerAddress: ownerInfo.address || '',
        ownerTitle: ownerInfo.title || 'Copyright Owner',
        businessName: ownerInfo.businessName || '',
        
        // Additional details
        registrationNumber: ownerInfo.registrationNumber || 'Pending',
        publicationDate: ownerInfo.publicationDate || '',
        creationDate: ownerInfo.creationDate || new Date().toLocaleDateString(),
        evidenceDescription: ownerInfo.evidenceDescription || 'Original files and creation records available upon request',
        urgencyReason: infringement.urgencyReason || 'Commercial harm',
        harmDescription: infringement.harmDescription || 'Unauthorized use is causing economic harm and brand confusion',
        
        // Current date
        currentDate: new Date().toLocaleDateString(),
      };

      const notice = compiledTemplate(data);
      
      return {
        subject: this.extractSubject(notice),
        body: notice,
        recipientEmail: platformInfo.email,
        platformForm: platformInfo.form,
        platformName: platformInfo.name,
        template: template,
        generatedAt: new Date().toISOString(),
      };

    } catch (error) {
      throw new Error(`Failed to generate DMCA notice: ${error.message}`);
    }
  }

  extractSubject(notice) {
    const lines = notice.split('\n');
    const subjectLine = lines.find(line => line.startsWith('Subject:'));
    return subjectLine ? subjectLine.replace('Subject:', '').trim() : 'DMCA Takedown Notice';
  }

  determineInfringementType(infringement) {
    const url = infringement.url.toLowerCase();
    
    if (url.includes('torrent') || url.includes('download')) {
      return 'Unauthorized distribution';
    }
    if (url.includes('social') || url.includes('instagram') || url.includes('facebook')) {
      return 'Social media copyright violation';
    }
    if (url.includes('blog') || url.includes('website')) {
      return 'Website copyright infringement';
    }
    
    return 'Unauthorized reproduction';
  }

  async batchGenerateNotices(infringements, ownerInfo) {
    const notices = [];
    
    for (const infringement of infringements) {
      try {
        const template = this.selectTemplate(infringement);
        const notice = this.generateDmcaNotice(infringement, ownerInfo, template);
        notices.push({
          infringementId: infringement.id,
          ...notice,
        });
      } catch (error) {
        notices.push({
          infringementId: infringement.id,
          error: error.message,
        });
      }
    }
    
    return notices;
  }

  selectTemplate(infringement) {
    if (infringement.priority === 'high' || infringement.urgencyReason) {
      return 'urgent';
    }
    if (infringement.hasDetailedEvidence || infringement.registrationNumber) {
      return 'detailed';
    }
    return 'standard';
  }

  getPlatformSubmissionInfo(platform) {
    return this.platformContacts[platform.toLowerCase()] || null;
  }

  validateNotice(notice) {
    const requiredFields = [
      'contentTitle',
      'infringingUrl',
      'ownerName',
      'ownerEmail',
    ];

    const missing = requiredFields.filter(field => 
      !notice.body.includes(`{{${field}}}`) && !notice.body.includes(field)
    );

    return {
      isValid: missing.length === 0,
      missingFields: missing,
      hasGoodFaithStatement: notice.body.includes('good faith belief'),
      hasPerjuryStatement: notice.body.includes('penalty of perjury'),
      hasSignature: notice.body.includes('/s/'),
    };
  }
}

// Worker thread execution
async function runDmcaAgent() {
  const agent = new DmcaAgent();
  
  try {
    // Mock infringement data for demonstration
    const mockInfringements = [
      {
        id: 1,
        url: 'https://example-infringing-site.com/stolen-content',
        platform: 'google',
        contentTitle: 'Protected Creative Work',
        contentDescription: 'Original digital artwork',
        priority: 'high',
      },
      {
        id: 2,
        url: 'https://social-platform.com/unauthorized-post',
        platform: 'facebook',
        contentTitle: 'Professional Photography',
        contentDescription: 'Commercial photography portfolio piece',
        priority: 'medium',
      },
    ];

    const mockOwnerInfo = {
      name: 'Creative Professional',
      email: 'legal@creativepro.com',
      phone: '+1-555-123-4567',
      address: '123 Creator Street, Art City, AC 12345',
      title: 'Copyright Owner',
      businessName: 'Creative Pro Studios LLC',
    };

    const notices = await agent.batchGenerateNotices(mockInfringements, mockOwnerInfo);

    if (parentPort) {
      parentPort.postMessage({
        status: 'success',
        agent: 'dmca-agent',
        results: {
          noticesGenerated: notices.length,
          notices: notices,
          platforms: [...new Set(mockInfringements.map(i => i.platform))],
        },
        timestamp: new Date().toISOString(),
      });
    }

  } catch (error) {
    if (parentPort) {
      parentPort.postMessage({
        status: 'error',
        agent: 'dmca-agent',
        error: error.message,
        timestamp: new Date().toISOString(),
      });
    }
  }
}

// Run if this is a worker thread
if (parentPort) {
  runDmcaAgent();
}

module.exports = DmcaAgent;
