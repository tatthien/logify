import { SSTConfig } from 'sst'
import { MainStack } from './sst/stacks/main'

export default {
  config(_input) {
    return {
      name: 'click-up-time-tracking',
      region: 'ap-southeast-1',
      profile: process.env.AWS_PROFILE,
    }
  },
  stacks(app) {
    app.stack(MainStack, { id: `${app.stage}-main-stack` })
  },
} satisfies SSTConfig
