// This is based on https://github.com/d3/d3-time-format#locale_format
// See also https://man7.org/linux/man-pages/man3/strftime.3.html
// and https://www.strfti.me/?f=%25l

// N.B., some directives supported by d3-date-time are not included here:
/*
%x - the locales date, such as %-m/%-d/%Y.*
%X - the locales time, such as %-I:%M:%S %p.*
%c - the locales date and time, such as %x, %X.*
    
%% - a literal percent sign (%).
*/
export interface DirectiveItem {
  code: string,
  definition: string,
  example: string,
  display: string
}

export interface Directives {
  [type: string]: DirectiveItem[]
}

export const directives: Directives = {
  Year: [
    {
      code: '%Y',
      definition: 'year with century as a decimal number',
      example: '1999',
      display:'YYYY'
    },
    {
      code: '%y',
      definition: 'year without century as a decimal number',
      example: '99',
       display: 'YY'
    },
    // {
    //   code: '%G',
    //   definition: 'ISO 8601 week-based year with century as a decimal number',
    //   example: '1999',
    // },
    // {
    //   code: '%g',
    //   definition: 'ISO 8601 week-based year without century as a decimal number',
    //   example: '99',
    // }
  ],

  Month: [
    {
      code: '%m',
      definition: 'month as a decimal number [01,12]',
      example: '11',
      display: 'MM'
    },
    {
      code: '%b',
      definition: 'abbreviated month name',
      example: 'Nov',
      display: 'MMM'
    },
    {
      code: '%B',
      definition: 'full month name',
      example: 'November',
      display: 'MMMM'
    },
  ],

  'Day of month': [
    {
      code: '%d',
      definition: 'zero-padded day of the month as a decimal number [01,31]',
      example: '04',
      display: 'DD'
    },
    // {
    //   code: '%e',
    //   definition: 'space-padded day of the month as a decimal number [ 1,31]; equivalent to %_d',
    //   example: ' 4',
    // }
  ],

  Time: [
    {
      code: '%H',
      definition: 'hour (24-hour clock) as a decimal number [00,23]',
      example: '22',
      display: 'HH'
    },
    {
      code: '%I',
      definition: 'hour (12-hour clock) as a decimal number [01,12]',
      example: '10',
      display: 'hh'
    },
    // {
    //   code: '%P',
    //   definition: 'either A (for AM) or P (for PM).',
    //   example: 'AM',
    //   display: 'A'
    // },
    {
      code: '%p',
      definition: 'either AM or PM.',
      example: 'AM',
      display: 'A'
    },
    {
      code: '%M',
      definition: 'minute as a decimal number [00,59]',
      example: '45',
      display: 'mm'
    },
    {
      code: '%S',
      definition: 'second as a decimal number [00,59]',
      example: '15',
      display: 'ss'
    },
    // {
    //   code: '%L',
    //   definition: 'milliseconds as a decimal number [000, 999]',
    //   example: '400',
    //   display: 
    // },
    // {
    //   code: '%f',
    //   definition: 'microseconds as a decimal number [000000, 999999]',
    //   example: '400000'
    // },
    {
      code: '%Z',
      definition: 'time zone offset',
      example: '',
      display: 'ZZ'
    }
  ],

  Quarter: [
    {
      code: '%q',
      definition: 'quarter of the year as a decimal number [1,4]',
      example: '2',
      display: 'Q'
    }
  ],

  'Week of year': [
    // {
    //   code: '%U',
    //   definition: 'Sunday-based week of the year as a decimal number [00,53]',
    //   example: '42'
    // },
    // {
    //   code: '%W',
    //   definition: 'Monday-based week of the year as a decimal number [00,53]',
    //   example: '42',
    //   display: ''
    // },
    {
      code: '%V',
      definition: 'ISO 8601 week of the year as a decimal number [01, 53]',
      example: '41',
      display: 'WW'
    }
  ],

  'Day of week': [
    {
      code: '%a',
      definition: 'abbreviated weekday name',
      example: 'Tue',
      display: 'ddd'
    },
    {
      code: '%A',
      definition: 'full weekday name',
      example: 'Tuesday',
      display: 'dddd'
    },
    {
      code: '%u',
      definition: 'Monday-based (ISO 8601) weekday as a decimal number [1,7]',
      example: '2',
      display: 'E'
    },
    // {
    //   code: '%w',
    //   definition: 'Sunday-based weekday as a decimal number [0,6]',
    //   example: '1'
    // }
  ],

  'Day of year': [
    {
      code: '%j',
      definition: 'day of the year as a decimal number [001,366]',
      example: '125',
      display: 'DDDD',
    }
  ],

  'Unix time': [
    {
      code: '%s',
      definition: 'seconds since UNIX epoch',
      example: '1634050951',
      display: 'X'
    },
    {
      code: '%Q',
      definition: 'milliseconds since UNIX epoch',
      example: '1634050951000',
      display: 'x',
    }
  ]
};
