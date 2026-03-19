import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create the demo banker
  const bankerPasswordHash = await bcrypt.hash('demobank', 12)
  const banker = await prisma.banker.upsert({
    where: { username: 'demo' },
    update: {},
    create: {
      username: 'demo',
      passwordHash: bankerPasswordHash,
      bankName: 'Demo Family Bank',
      settings: {
        create: { annualInterestRate: 0.05 },
      },
    },
  })

  console.log(`Banker created: ${banker.username} (id: ${banker.id})`)

  // ── Alex ────────────────────────────────────────────────────────────────────
  const alexHash = await bcrypt.hash('alex123', 10)
  const alex = await prisma.user.upsert({
    where: { username: 'alex' },
    update: {},
    create: {
      username: 'alex',
      name: 'Alex',
      passwordHash: alexHash,
      colorTheme: 'sky',
      bankerId: banker.id,
      account: { create: { currentBalance: 0 } },
    },
    include: { account: true },
  })

  if (alex.account) {
    // Clear existing transactions before re-seeding
    await prisma.transaction.deleteMany({ where: { accountId: alex.account.id } })

    const alexTxs = [
      { date: new Date('2026-01-01'), amount: 20.00,  type: 'credit', description: 'Weekly allowance' },
      { date: new Date('2026-01-08'), amount: 20.00,  type: 'credit', description: 'Weekly allowance' },
      { date: new Date('2026-01-10'), amount: 15.00,  type: 'credit', description: 'Chores bonus — mowed the lawn' },
      { date: new Date('2026-01-15'), amount: -8.50,  type: 'debit',  description: 'Bought a book at school fair' },
      { date: new Date('2026-02-01'), amount: 199.00, type: 'credit', description: 'Birthday money from grandma' },
    ]
    await prisma.transaction.createMany({ data: alexTxs.map(t => ({ ...t, accountId: alex.account!.id })) })

    const alexBalance = alexTxs.reduce((sum, t) => sum + t.amount, 0)
    await prisma.account.update({ where: { id: alex.account.id }, data: { currentBalance: alexBalance } })
    console.log(`Alex seeded — balance: $${alexBalance.toFixed(2)}`)
  }

  // ── Sam ─────────────────────────────────────────────────────────────────────
  const samHash = await bcrypt.hash('sam123', 10)
  const sam = await prisma.user.upsert({
    where: { username: 'sam' },
    update: {},
    create: {
      username: 'sam',
      name: 'Sam',
      passwordHash: samHash,
      colorTheme: 'rose',
      bankerId: banker.id,
      account: { create: { currentBalance: 0 } },
    },
    include: { account: true },
  })

  if (sam.account) {
    await prisma.transaction.deleteMany({ where: { accountId: sam.account.id } })

    const samTxs = [
      { date: new Date('2026-01-01'), amount: 10.00,  type: 'credit', description: 'Weekly allowance' },
      { date: new Date('2026-01-08'), amount: 10.00,  type: 'credit', description: 'Weekly allowance' },
      { date: new Date('2026-01-12'), amount: 5.00,   type: 'credit', description: 'Helped wash the car' },
      { date: new Date('2026-01-20'), amount: -14.75, type: 'debit',  description: 'Toy from the toy store' },
      { date: new Date('2026-02-05'), amount: 79.00,  type: 'credit', description: 'Holiday gift money' },
    ]
    await prisma.transaction.createMany({ data: samTxs.map(t => ({ ...t, accountId: sam.account!.id })) })

    const samBalance = samTxs.reduce((sum, t) => sum + t.amount, 0)
    await prisma.account.update({ where: { id: sam.account.id }, data: { currentBalance: samBalance } })
    console.log(`Sam seeded — balance: $${samBalance.toFixed(2)}`)
  }

  // ── Riley ───────────────────────────────────────────────────────────────────
  const rileyHash = await bcrypt.hash('riley123', 10)
  const riley = await prisma.user.upsert({
    where: { username: 'riley' },
    update: {},
    create: {
      username: 'riley',
      name: 'Riley',
      passwordHash: rileyHash,
      colorTheme: 'emerald',
      bankerId: banker.id,
      account: { create: { currentBalance: 0 } },
    },
    include: { account: true },
  })

  if (riley.account) {
    await prisma.transaction.deleteMany({ where: { accountId: riley.account.id } })

    const rileyTxs = [
      { date: new Date('2025-11-01'), amount: 50.00,  type: 'credit', description: 'Weekly allowance x5 (catch-up)' },
      { date: new Date('2025-12-01'), amount: 200.00, type: 'credit', description: 'Christmas money' },
      { date: new Date('2026-01-01'), amount: 25.00,  type: 'credit', description: 'Weekly allowance' },
      { date: new Date('2026-01-08'), amount: 25.00,  type: 'credit', description: 'Weekly allowance' },
      { date: new Date('2026-01-14'), amount: -38.00, type: 'debit',  description: 'Art supplies' },
      { date: new Date('2026-02-01'), amount: 150.00, type: 'credit', description: 'Birthday money' },
    ]
    await prisma.transaction.createMany({ data: rileyTxs.map(t => ({ ...t, accountId: riley.account!.id })) })

    const rileyBalance = rileyTxs.reduce((sum, t) => sum + t.amount, 0)
    await prisma.account.update({ where: { id: riley.account.id }, data: { currentBalance: rileyBalance } })
    console.log(`Riley seeded — balance: $${rileyBalance.toFixed(2)}`)
  }

  console.log('Seed complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
