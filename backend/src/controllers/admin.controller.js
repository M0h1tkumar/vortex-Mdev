import { prisma } from '../config/db.js';
import { sendMail } from '../utils/mail.js';

export const reevaluateTeams = async (req, res, next) => {
  try {
    const config = await prisma.globalConfig.findUnique({ where: { id: 'vortex_config' } });
    const rules = config || { minTeamMembers: 4, maxTeamMembers: 5, minFemaleMembers: 1, minDomainExperts: 2 };

    const teams = await prisma.team.findMany();
    let updatedCount = 0;

    for (const team of teams) {
      const hasFemale = team.femaleCount >= rules.minFemaleMembers;
      const hasMinDomainExperts = team.domainSpecificCount >= rules.minDomainExperts;
      const hasMinMembers = team.memberCount >= rules.minTeamMembers;
      const withinMaxMembers = team.memberCount <= rules.maxTeamMembers;

      const shouldBeConfirmed = hasFemale && hasMinDomainExperts && hasMinMembers && withinMaxMembers;
      const currentStatus = shouldBeConfirmed ? 'CONFIRMED' : 'FORMING';

      if (team.teamStatus !== currentStatus) {
        await prisma.team.update({
          where: { id: team.id },
          data: { teamStatus: currentStatus }
        });
        updatedCount++;
      }
    }

    res.json({ message: `REEVALUATION_COMPLETE: ${updatedCount} SQUADS_UPDATED` });
  } catch (err) {
    next(err);
  }
};

export const updateGlobalConfig = async (req, res, next) => {
  try {
    const config = await prisma.globalConfig.upsert({
      where: { id: 'vortex_config' },
      update: req.body,
      create: { id: 'vortex_config', ...req.body }
    });
    res.json(config);
  } catch (err) {
    next(err);
  }
};

export const getGlobalConfig = async (req, res, next) => {
  try {
    const config = await prisma.globalConfig.findUnique({
      where: { id: 'vortex_config' }
    });
    res.json(config || {});
  } catch (err) {
    next(err);
  }
};

export const broadcastMail = async (req, res, next) => {
  try {
    const { subject, text, target } = req.body; // target: 'ALL' or 'LEADS'
    
    let emails = [];
    if (target === 'LEADS') {
      const leads = await prisma.student.findMany({
        where: { role: 'TEAMLEAD' },
        select: { email: true }
      });
      emails = leads.map(l => l.email);
    } else {
      const all = await prisma.student.findMany({
        where: { verificationStatus: 'VERIFIED' },
        select: { email: true }
      });
      emails = all.map(a => a.email);
    }

    for (const email of emails) {
      await sendMail({ to: email, subject, text });
    }

    res.json({ message: `BROADCAST_TRANSMITTED: ${emails.length} RECIPIENTS` });
  } catch (err) {
    next(err);
  }
};

export const generateReport = async (req, res, next) => {
  try {
    const studentsWithoutTeam = await prisma.student.findMany({
      where: { 
        role: 'STUDENT',
        verificationStatus: 'VERIFIED',
        teams: { none: {} }
      },
      include: { institute: true, domain: true, problemStatement: true }
    });

    const teams = await prisma.team.findMany({
      include: {
        problemStatement: true,
        leader: true,
        members: { include: { student: true } }
      }
    });

    const report = {
      timestamp: new Date(),
      operatives: {
        totalVerified: await prisma.student.count({ where: { verificationStatus: 'VERIFIED' } }),
        unassigned: studentsWithoutTeam.length,
        unassignedList: studentsWithoutTeam
      },
      squads: {
        total: teams.length,
        qualified: [],
        unqualified: []
      }
    };

    const config = await prisma.globalConfig.findUnique({ where: { id: 'vortex_config' } });
    const rules = config || { minTeamMembers: 2, maxTeamMembers: 5, minFemaleMembers: 1, minDomainExperts: 1 };

    for (const team of teams) {
      const hasFemale = team.femaleCount >= rules.minFemaleMembers;
      const hasMinDomainExperts = team.domainSpecificCount >= rules.minDomainExperts;
      const hasMinMembers = team.memberCount >= rules.minTeamMembers;

      const isQualified = hasFemale && hasMinDomainExperts && hasMinMembers;
      
      const teamData = {
        id: team.id,
        name: team.teamName,
        members: team.memberCount,
        femaleCount: team.femaleCount,
        domainExpertCount: team.domainSpecificCount,
        reason: !isQualified ? `${!hasFemale ? `Need ${rules.minFemaleMembers} female member(s). ` : ''}${!hasMinDomainExperts ? `Insufficient domain experts (need ${rules.minDomainExperts}). ` : ''}${!hasMinMembers ? `Minimum ${rules.minTeamMembers} members required.` : ''}` : null
      };

      if (isQualified) {
        report.squads.qualified.push(teamData);
      } else {
        report.squads.unqualified.push(teamData);
      }
    }

    res.json(report);
  } catch (err) {
    next(err);
  }
};
