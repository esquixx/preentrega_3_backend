import { Command } from 'commander'

const program = new Command()

program.option('-d, --debug', 'variable para debug', false)
.option('--persistence <persistence>', 'persistencia')
program.parse()

export const opts = program.opts()