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
		--name  Your name
		--help  Usage

	Examples
	  $ cli --name=Jane
	  Hello, Jane
`,
    {
      importMeta: import.meta,
      flags: {
        name: {
          type: 'string'
        }
      }
    }
)

render(<AppCli name={cli.flags.name} />)
