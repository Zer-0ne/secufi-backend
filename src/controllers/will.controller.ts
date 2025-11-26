import { Response } from 'express';
import { PrismaClient, WillSectionType } from '@prisma/client';
import { AuthenticatedRequest } from '@/middlewares/auth.middleware';

const prisma = new PrismaClient();

export class WillController {
  // Get user's will
  async getWill(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.userId as string;

      const will = await prisma.will.findUnique({
        where: { user_id: userId },
        include: {
          will_sections: true,
        },
      });

      if (!will) {
        return res.status(404).json({ message: 'Will not found' });
      }

      return res.json(will);
    } catch (error) {
      console.error('Error fetching will:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Create a new will
  async createWill(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.userId!;
      const { title, description } = req.body;

      // Check if user already has a will
      const existingWill = await prisma.will.findUnique({
        where: { user_id: userId },
      });

      if (existingWill) {
        return res.status(400).json({ message: 'User already has a will' });
      }

      // Create will with default sections
      const will = await prisma.will.create({
        data: {
          user_id: userId,
          title: title || 'My Last Will & Testament',
          description,
          will_sections: {
            create: [
              {
                title: 'Personal Information',
                description: 'Name, address, personal law selection',
                section_type: 'personal_info',
                order: 1,
                is_required: true,
              },
              {
                title: 'Executors & Guardians',
                description: 'Appointed executor and guardian for minors',
                section_type: 'executors_guardians',
                order: 2,
                is_required: true,
              },
              {
                title: 'Asset Bequests',
                description: 'Distribution of assets to beneficiaries',
                section_type: 'asset_bequests',
                order: 3,
                is_required: true,
              },
              {
                title: 'Digital Assets',
                description: 'Social media, crypto, digital accounts',
                section_type: 'digital_assets',
                order: 4,
                is_required: false,
              },
              {
                title: 'Video Witness Kit',
                description: 'Testator + 2 witnesses video evidence',
                section_type: 'video_witness',
                order: 5,
                is_required: true,
              },
              {
                title: 'Legal Review',
                description: 'Legal counsel review and finalization',
                section_type: 'legal_review',
                order: 6,
                is_required: false,
              },
            ],
          },
        },
        include: {
          will_sections: true,
        },
      });

      return res.status(201).json(will);
    } catch (error) {
      console.error('Error creating will:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Update will
  async updateWill(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.userId!;
      const { title, description, status } = req.body;

      const will = await prisma.will.update({
        where: { user_id: userId },
        data: {
          title,
          description,
          status,
        },
      });

      res.json(will);
    } catch (error) {
      console.error('Error updating will:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Delete will
  async deleteWill(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.userId!;

      await prisma.will.delete({
        where: { user_id: userId },
      });

      res.json({ message: 'Will deleted successfully' });
    } catch (error) {
      console.error('Error deleting will:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Get all will sections
  async getWillSections(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.userId!;

      const will = await prisma.will.findUnique({
        where: { user_id: userId },
        include: {
          will_sections: {
            orderBy: { order: 'asc' },
          },
        },
      });

      if (!will) {
        return res.status(404).json({ message: 'Will not found' });
      }

      return res.json(will.will_sections);
    } catch (error) {
      console.error('Error fetching will sections:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Get specific will section
  async getWillSection(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.userId!;
      const { sectionType } = req.params;

      const will = await prisma.will.findUnique({
        where: { user_id: userId },
        include: {
          will_sections: {
            where: { section_type: sectionType as WillSectionType as WillSectionType },
          },
        },
      });

      if (!will || will.will_sections.length === 0) {
        return res.status(404).json({ message: 'Section not found' });
      }

      return res.json(will.will_sections[0]);
    } catch (error) {
      console.error('Error fetching will section:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Update will section
  async updateWillSection(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.userId!;
      const { sectionType } = req.params;
      const { content, status } = req.body;

      const will = await prisma.will.findUnique({
        where: { user_id: userId },
        include: {
          will_sections: {
            where: { section_type: sectionType as WillSectionType },
          },
        },
      });

      if (!will || will.will_sections.length === 0) {
        return res.status(404).json({ message: 'Section not found' });
      }

      const section = will.will_sections[0];

      const updatedSection = await prisma.willSection.update({
        where: { id: section.id },
        data: {
          content,
          status,
          completed_at: status === 'complete' ? new Date() : null,
        },
      });

      return res.json(updatedSection);
    } catch (error) {
      console.error('Error updating will section:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Get beneficiaries
  async getBeneficiaries(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.userId!;

      const will = await prisma.will.findUnique({
        where: { user_id: userId },
        include: {
          beneficiaries: true,
        },
      });

      if (!will) {
        return res.status(404).json({ message: 'Will not found' });
      }

      return res.json(will.beneficiaries);
    } catch (error) {
      console.error('Error fetching beneficiaries:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Add beneficiary
  async addBeneficiary(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.userId!;
      const { name, relationship, address, phone, email, percentage, specific_assets } = req.body;

      const will = await prisma.will.findUnique({
        where: { user_id: userId },
      });

      if (!will) {
        return res.status(404).json({ message: 'Will not found' });
      }

      const beneficiary = await prisma.willBeneficiary.create({
        data: {
          will_id: will.id,
          name,
          relationship,
          address,
          phone,
          email,
          percentage,
          specific_assets,
        },
      });

      return res.status(201).json(beneficiary);
    } catch (error) {
      console.error('Error adding beneficiary:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Update beneficiary
  async updateBeneficiary(req: AuthenticatedRequest, res: Response) {
    try {
      const { beneficiaryId } = req.params;
      const updateData = req.body;

      const beneficiary = await prisma.willBeneficiary.update({
        where: { id: beneficiaryId },
        data: updateData,
      });

      res.json(beneficiary);
    } catch (error) {
      console.error('Error updating beneficiary:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Delete beneficiary
  async deleteBeneficiary(req: AuthenticatedRequest, res: Response) {
    try {
      const { beneficiaryId } = req.params;

      await prisma.willBeneficiary.delete({
        where: { id: beneficiaryId },
      });

      res.json({ message: 'Beneficiary deleted successfully' });
    } catch (error) {
      console.error('Error deleting beneficiary:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Get video witness status
  async getVideoWitnessStatus(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.userId!;

      const will = await prisma.will.findUnique({
        where: { user_id: userId },
      });

      if (!will) {
        return res.status(404).json({ message: 'Will not found' });
      }

      return res.json({
        testator: will.video_witness_status === 'complete' ? 'complete' : 'pending',
        witness1: will.witness1_video_url ? 'complete' : 'pending',
        witness2: will.witness2_video_url ? 'complete' : 'pending',
      });
    } catch (error) {
      console.error('Error fetching video witness status:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Upload testator video
  async uploadTestatorVideo(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.userId!;
      const { videoUrl } = req.body;

      const will = await prisma.will.update({
        where: { user_id: userId },
        data: {
          testator_video_url: videoUrl,
          video_witness_status: 'complete',
        },
      });

      res.json(will);
    } catch (error) {
      console.error('Error uploading testator video:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Upload witness 1 video
  async uploadWitness1Video(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.userId!;
      const { videoUrl, witnessName, witnessEmail } = req.body;

      const will = await prisma.will.update({
        where: { user_id: userId },
        data: {
          witness1_video_url: videoUrl,
          witness1_name: witnessName,
          witness1_email: witnessEmail,
        },
      });

      res.json(will);
    } catch (error) {
      console.error('Error uploading witness 1 video:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Upload witness 2 video
  async uploadWitness2Video(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.userId!;
      const { videoUrl, witnessName, witnessEmail } = req.body;

      const will = await prisma.will.update({
        where: { user_id: userId },
        data: {
          witness2_video_url: videoUrl,
          witness2_name: witnessName,
          witness2_email: witnessEmail,
        },
      });

      res.json(will);
    } catch (error) {
      console.error('Error uploading witness 2 video:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Preview will
  async previewWill(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.userId!;

      const will = await prisma.will.findUnique({
        where: { user_id: userId },
        include: {
          will_sections: true,
          beneficiaries: true,
        },
      });

      if (!will) {
        return res.status(404).json({ message: 'Will not found' });
      }

      // Generate preview data (simplified for now)
      const previewData = {
        title: will.title,
        testator_name: will.testator_name,
        executor_name: will.executor_name,
        guardian_name: will.guardian_name,
        beneficiaries: will.beneficiaries!,
        sections: will.will_sections!,
        status: will.status,
      };

      return res.json(previewData);
    } catch (error) {
      console.error('Error generating will preview:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Download will PDF
  async downloadWill(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.userId!;

      const will = await prisma.will.findUnique({
        where: { user_id: userId },
        include: {
          will_sections: true,
          beneficiaries: true,
        },
      });

      if (!will) {
        return res.status(404).json({ message: 'Will not found' });
      }

      // TODO: Generate actual PDF document
      // For now, return will data
      return res.json({
        message: 'PDF generation not implemented yet',
        will,
      });
    } catch (error) {
      console.error('Error downloading will:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Get will progress
  async getWillProgress(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.userId!;

      const will = await prisma.will.findUnique({
        where: { user_id: userId },
        include: {
          will_sections: true,
        },
      });

      if (!will) {
        return res.status(404).json({ message: 'Will not found' });
      }

      const completedSections = will.will_sections.filter(s => s.status === 'complete').length;
      const totalSections = will.will_sections.length;
      const progressPercent = Math.round((completedSections / totalSections) * 100);

      return res.json({
        progressPercent,
        completedSections,
        totalSections,
        sections: will.will_sections,
      });
    } catch (error) {
      console.error('Error fetching will progress:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Sign will
  async signWill(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.userId!;

      const will = await prisma.will.update({
        where: { user_id: userId },
        data: {
          status: 'signed',
          signed_at: new Date(),
        },
      });

      return res.json(will);
    } catch (error) {
      console.error('Error signing will:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Get legal information
  async getLegalInfo(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.userId!;

      const will = await prisma.will.findUnique({
        where: { user_id: userId },
      });

      if (!will) {
        return res.status(404).json({ message: 'Will not found' });
      }

      const legalInfo = {
        lawyer_name: will.lawyer_name,
        lawyer_firm: will.lawyer_firm,
        lawyer_address: will.lawyer_address,
        lawyer_phone: will.lawyer_phone,
        lawyer_email: will.lawyer_email,
      };

      return res.json(legalInfo);
    } catch (error) {
      console.error('Error fetching legal info:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Update legal information
  async updateLegalInfo(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.userId!;
      const { lawyer_name, lawyer_firm, lawyer_address, lawyer_phone, lawyer_email } = req.body;

      const will = await prisma.will.update({
        where: { user_id: userId },
        data: {
          lawyer_name,
          lawyer_firm,
          lawyer_address,
          lawyer_phone,
          lawyer_email,
        },
      });

      res.json(will);
    } catch (error) {
      console.error('Error updating legal info:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}