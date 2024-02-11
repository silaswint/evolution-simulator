#!/usr/bin/env node
/* eslint-disable no-tabs */
import React from 'react'
import { render } from 'ink'
import meow from 'meow'
import AppCli from './AppCli'

const cli = meow(
    `
	Usage
	  $ cli

	Options
		--saveThresholdGenerations (default: 50) Minimum number of survived generations to save the model
		--help  Help for usage

	Examples
	  $ cli --saveThresholdGenerations=100
	  Sets the minimum number of survived generations until the model starts to save
`,
    {
      importMeta: import.meta,
      flags: {
        minSurvivedGenerationsForSaveModel: {
          type: 'number'
        }
      }
    }
)

render(<AppCli saveThresholdGenerations={cli.flags.saveThresholdGenerations} />)
