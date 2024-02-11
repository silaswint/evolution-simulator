#!/usr/bin/env node
/* eslint-disable no-tabs */
import React from 'react'
import { render } from 'ink'
import meow from 'meow'
import AppCli from './AppCli'
import { config } from '@/utils/config/config'

const cli = meow(
    `
	Usage
	  $ cli

	Options
		--challenge  (default: ${config.challenge}) Challenge to train for
		--saveThresholdGenerations  (default: 50) Minimum number of survived generations to save the model
		--help  Help for usage

	Examples
	  $ cli --saveThresholdGenerations=100
	  Sets the minimum number of survived generations until the model starts to save
	  
	  $ cli --challenge=3
	  Sets the challenge to CHALLENGE_INNER_CIRCLE_SURVIVES
`,
    {
      importMeta: import.meta,
      flags: {
        minSurvivedGenerationsForSaveModel: {
          type: 'number'
        },
        challenge: {
          type: 'number'
        }
      }
    }
)

render(<AppCli saveThresholdGenerations={cli.flags.saveThresholdGenerations} challenge={cli.flags.challenge} />)
