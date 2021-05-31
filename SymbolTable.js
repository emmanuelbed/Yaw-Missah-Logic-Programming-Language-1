/***<Logic Programming Language.>
Copyright (C) <2021>  <Dr. Yaw Missah & Gerald Annan>

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
***/

const _SYMBOLS_ = {
  _USER_NAMES_: [],
  _ITERATIONS_: [
    /^\s*from\s+(.+)\s+to\s+(.+)\s+as\s+(.+)\s+in steps of\s+(.+)/i,
    /^\s*from\s+(.+)\s+to\s+(.+)\s+as\s+(.+)/i,
    /^\s*from\s+(.+)\s+to\s+(.+)/i,
  ],
  _CONDITIONALS_: [
    /^\s*(else if)\s+(.+)/i,
    /^\s*(else)$/i,
    // /^\s*(if)\s*(.+)\sthen$/i,
    // /^\s*(if)\s*(.+)\,$/i,
    /^\s*(if)\s+(.+)$/i,
  ],
  _VARIABLES_: [
    /^\s*set\s([^\=]+)(\=)(.+)$/i,
    /^\s*set\s(.+)\s(as)\s(.+)$/i,
    /^\s*set\s(.+)\s(to)\s(.+)$/i,
    /^\s*let\s(.+)\s(be)\s(.+)$/i,
    /^\s*let\s([^\=]+)(\=)(.+)$/i,
    /^\s*initialize\s(.+)\s(to)\s(.+)$/i,
    /^\s*initialize\s(.+)\s(as)\s(.+)$/i,
    /^\s*(.+)\s(\=)(.+)$/i,
  ],
  _ASSIGNMENTS_: [
    /^\s*set\s([^\=]+)(\=)(.+)(\+)(.+)$/i,
    /^\s*set\s([^\=]+)(\=)(.+)\s(plus)\s(.+)$/i,
    /^\s*set\s([^\=]+)(\=)(.+)(\-)(.+)$/i,
    /^\s*set\s([^\=]+)(\=)(.+)\s(minus)\s(.+)$/i,
    /^\s*set\s([^\=]+)(\=)([^\*]+)([\*]+)(.+)$/i,
    /^\s*set\s([^\=]+)(\=)(.+)\s(by|of|times)\s(.+)$/i,
    /^\s*set\s([^\=]+)(\=)(.+)(\/)(.+)$/i,
    /^\s*set\s([^\=]+)(\=)(.+)(\%)(.+)$/i,
    /^\s*set\s([^\=]+)(\=)(.+)(\=\=)(.+)$/i,
    /^\s*set\s([^\=]+)(\=)(.+)\s(and)\s(.+)$/i,
    /^\s*set\s([^\=]+)(\=)(.+)\s(or)\s(.+)$/i,

    /^\s*set\s([^\=]+)(\=)(.+)\s(is equal to)\s(.+)$/i,
    /^\s*set\s([^\=]+)(\=)(.+)(\!\=)(.+)$/i,
    /^\s*set\s([^\=]+)(\=)(.+)\s(is not equal to)\s(.+)$/i,
    /^\s*set\s([^\=]+)(\=)(.+)\s(is not)\s(.+)$/i,
    /^\s*set\s([^\=]+)(\=)(.+)(\>)(.+)$/i,
    /^\s*set\s([^\=]+)(\=)(.+)(\<)(.+)$/i,
    /^\s*set\s([^\=]+)(\=)(.+)\s(is greater than or equals)\s(.+)$/i,
    /^\s*set\s([^\=]+)(\=)(.+)\s(is greater than or equal to)\s(.+)$/i,
    /^\s*set\s([^\=]+)(\=)(.+)(\>\=)(.+)$/i,
    /^\s*set\s([^\=]+)(\=)(.+)\s(is less than or equals)\s(.+)$/i,
    /^\s*set\s([^\=]+)(\=)(.+)\s(is less than or equal to)\s(.+)$/i,
    /^\s*set\s([^\=]+)(\=)(.+)(\<\=)(.+)$/i,
    /^\s*set\s([^\=]+)(\=)(.+)\s(is greater than)\s(.+)$/i,
    /^\s*set\s([^\=]+)(\=)(.+)\s(is less than)\s(.+)$/i,
    /^\s*set\s([^\=]+)(\=)(.+)\s(is)\s(.+)$/i,
    /^\s*set\s([^\=]+)(\=)(.+)\s(equals)\s(.+)$/i,

    /^\s*set\s([^\=]+)(to)(.+)(\+)(.+)$/i,
    /^\s*set\s([^\=]+)(to)(.+)\s(plus)\s(.+)$/i,
    /^\s*set\s([^\=]+)(to)(.+)(\-)(.+)$/i,
    /^\s*set\s([^\=]+)(to)(.+)\s(minus)\s(.+)$/i,
    /^\s*set\s([^\=]+)(to)([^\*]+)([\*]+)(.+)$/i,
    /^\s*set\s([^\=]+)(to)(.+)\s(by|of|times)\s(.+)$/i,
    /^\s*set\s([^\=]+)(to)(.+)(\/)(.+)$/i,
    /^\s*set\s([^\=]+)(to)(.+)(\%)(.+)$/i,
    /^\s*set\s([^\=]+)(to)(.+)(\=\=)(.+)$/i,
    /^\s*set\s([^\=]+)(to)(.+)\s(and)\s(.+)$/i,
    /^\s*set\s([^\=]+)(to)(.+)\s(or)\s(.+)$/i,

    /^\s*set\s([^\=]+)(as)(.+)(\+)(.+)$/i,
    /^\s*set\s([^\=]+)(as)(.+)\s(plus)\s(.+)$/i,
    /^\s*set\s([^\=]+)(as)(.+)(\-)(.+)$/i,
    /^\s*set\s([^\=]+)(as)(.+)\s(minus)\s(.+)$/i,
    /^\s*set\s([^\=]+)(as)([^\*]+)([\*]+)(.+)$/i,
    /^\s*set\s([^\=]+)(as)(.+)\s(by|of|times)\s(.+)$/i,
    /^\s*set\s([^\=]+)(as)(.+)(\/)(.+)$/i,
    /^\s*set\s([^\=]+)(as)(.+)(\%)(.+)$/i,
    /^\s*set\s([^\=]+)(as)(.+)(\=\=)(.+)$/i,
    /^\s*set\s([^\=]+)(as)(.+)\s(and)\s(.+)$/i,
    /^\s*set\s([^\=]+)(as)(.+)\s(or)\s(.+)$/i,

    /^\s*set\s([^\=]+)(to)(.+)\s(is equal to)\s(.+)$/i,
    /^\s*set\s([^\=]+)(to)(.+)(\!\=)(.+)$/i,
    /^\s*set\s([^\=]+)(to)(.+)\s(is not equal to)\s(.+)$/i,
    /^\s*set\s([^\=]+)(to)(.+)\s(is not)\s(.+)$/i,
    /^\s*set\s([^\=]+)(to)(.+)(\>)(.+)$/i,
    /^\s*set\s([^\=]+)(to)(.+)(\<)(.+)$/i,
    /^\s*set\s([^\=]+)(to)(.+)\s(is greater than or equals)\s(.+)$/i,
    /^\s*set\s([^\=]+)(to)(.+)\s(is greater than or equal to)\s(.+)$/i,
    /^\s*set\s([^\=]+)(to)(.+)(\>\=)(.+)$/i,
    /^\s*set\s([^\=]+)(to)(.+)\s(is less than or equals)\s(.+)$/i,
    /^\s*set\s([^\=]+)(to)(.+)\s(is less than or equal to)\s(.+)$/i,
    /^\s*set\s([^\=]+)(to)(.+)(\<\=)(.+)$/i,
    /^\s*set\s([^\=]+)(to)(.+)\s(is greater than)\s(.+)$/i,
    /^\s*set\s([^\=]+)(to)(.+)\s(is less than)\s(.+)$/i,
    /^\s*set\s([^\=]+)(to)(.+)\s(is)\s(.+)$/i,
    /^\s*set\s([^\=]+)(to)(.+)\s(equals)\s(.+)$/i,

    /^\s*set\s([^\=]+)(as)(.+)\s(is equal to)\s(.+)$/i,
    /^\s*set\s([^\=]+)(as)(.+)(\!\=)(.+)$/i,
    /^\s*set\s([^\=]+)(as)(.+)\s(is not equal to)\s(.+)$/i,
    /^\s*set\s([^\=]+)(as)(.+)\s(is not)\s(.+)$/i,
    /^\s*set\s([^\=]+)(as)(.+)(\>)(.+)$/i,
    /^\s*set\s([^\=]+)(as)(.+)(\<)(.+)$/i,
    /^\s*set\s([^\=]+)(as)(.+)\s(is greater than or equals)\s(.+)$/i,
    /^\s*set\s([^\=]+)(as)(.+)\s(is greater than or equal to)\s(.+)$/i,
    /^\s*set\s([^\=]+)(as)(.+)(\>\=)(.+)$/i,
    /^\s*set\s([^\=]+)(as)(.+)\s(is less than or equals)\s(.+)$/i,
    /^\s*set\s([^\=]+)(as)(.+)\s(is less than or equal to)\s(.+)$/i,
    /^\s*set\s([^\=]+)(as)(.+)(\<\=)(.+)$/i,
    /^\s*set\s([^\=]+)(as)(.+)\s(is greater than)\s(.+)$/i,
    /^\s*set\s([^\=]+)(as)(.+)\s(is less than)\s(.+)$/i,
    /^\s*set\s([^\=]+)(as)(.+)\s(is)\s(.+)$/i,
    /^\s*set\s([^\=]+)(as)(.+)\s(equals)\s(.+)$/i,

    /^\s*let\s([^\=]+)(\=)(.+)(\+)(.+)$/i,
    /^\s*let\s([^\=]+)(\=)(.+)\s(plus)\s(.+)$/i,
    /^\s*let\s([^\=]+)(\=)(.+)(\-)(.+)$/i,
    /^\s*let\s([^\=]+)(\=)(.+)\s(minus)\s(.+)$/i,
    /^\s*let\s([^\=]+)(\=)([^\*]+)([\*]+)(.+)$/i,
    /^\s*let\s([^\=]+)(\=)(.+)\s(by|of|times)\s(.+)$/i,
    /^\s*let\s([^\=]+)(\=)(.+)(\/)(.+)$/i,
    /^\s*let\s([^\=]+)(\=)(.+)(\%)(.+)$/i,
    /^\s*let\s([^\=]+)(\=)(.+)(\=\=)(.+)$/i,
    /^\s*let\s([^\=]+)(\=)(.+)\s(and)\s(.+)$/i,
    /^\s*let\s([^\=]+)(\=)(.+)\s(or)\s(.+)$/i,

    /^\s*let\s([^\=]+)(\=)(.+)\s(is equal to)\s(.+)$/i,
    /^\s*let\s([^\=]+)(\=)(.+)(\!\=)(.+)$/i,
    /^\s*let\s([^\=]+)(\=)(.+)\s(is not equal to)\s(.+)$/i,
    /^\s*let\s([^\=]+)(\=)(.+)\s(is not)\s(.+)$/i,
    /^\s*let\s([^\=]+)(\=)(.+)(\>)(.+)$/i,
    /^\s*let\s([^\=]+)(\=)(.+)(\<)(.+)$/i,
    /^\s*let\s([^\=]+)(\=)(.+)\s(is greater than or equals)\s(.+)$/i,
    /^\s*let\s([^\=]+)(\=)(.+)\s(is greater than or equal to)\s(.+)$/i,
    /^\s*let\s([^\=]+)(\=)(.+)(\>\=)(.+)$/i,
    /^\s*let\s([^\=]+)(\=)(.+)\s(is less than or equals)\s(.+)$/i,
    /^\s*let\s([^\=]+)(\=)(.+)\s(is less than or equal to)\s(.+)$/i,
    /^\s*let\s([^\=]+)(\=)(.+)(\<\=)(.+)$/i,
    /^\s*let\s([^\=]+)(\=)(.+)\s(is greater than)\s(.+)$/i,
    /^\s*let\s([^\=]+)(\=)(.+)\s(is less than)\s(.+)$/i,
    /^\s*let\s([^\=]+)(\=)(.+)\s(is)\s(.+)$/i,
    /^\s*let\s([^\=]+)(\=)(.+)\s(equals)\s(.+)$/i,

    /^\s*let\s([^\=]+)(be)(.+)(\+)(.+)$/i,
    /^\s*let\s([^\=]+)(be)(.+)\s(plus)\s(.+)$/i,
    /^\s*let\s([^\=]+)(be)(.+)(\-)(.+)$/i,
    /^\s*let\s([^\=]+)(be)(.+)\s(minus)\s(.+)$/i,
    /^\s*let\s([^\=]+)(be)([^\*]+)([\*]+)(.+)$/i,
    /^\s*let\s([^\=]+)(be)(.+)\s(by|of|times)\s(.+)$/i,
    /^\s*let\s([^\=]+)(be)(.+)(\/)(.+)$/i,
    /^\s*let\s([^\=]+)(be)(.+)(\%)(.+)$/i,
    /^\s*let\s([^\=]+)(be)(.+)(\=\=)(.+)$/i,
    /^\s*let\s([^\=]+)(be)(.+)\s(and)\s(.+)$/i,
    /^\s*let\s([^\=]+)(be)(.+)\s(or)\s(.+)$/i,

    /^\s*let\s([^\=]+)(be)(.+)\s(is equal to)\s(.+)$/i,
    /^\s*let\s([^\=]+)(be)(.+)(\!\=)(.+)$/i,
    /^\s*let\s([^\=]+)(be)(.+)\s(is not equal to)\s(.+)$/i,
    /^\s*let\s([^\=]+)(be)(.+)\s(is not)\s(.+)$/i,
    /^\s*let\s([^\=]+)(be)(.+)(\>)(.+)$/i,
    /^\s*let\s([^\=]+)(be)(.+)(\<)(.+)$/i,
    /^\s*let\s([^\=]+)(be)(.+)\s(is greater than or equals)\s(.+)$/i,
    /^\s*let\s([^\=]+)(be)(.+)\s(is greater than or equal to)\s(.+)$/i,
    /^\s*let\s([^\=]+)(be)(.+)(\>\=)(.+)$/i,
    /^\s*let\s([^\=]+)(be)(.+)\s(is less than or equals)\s(.+)$/i,
    /^\s*let\s([^\=]+)(be)(.+)\s(is less than or equal to)\s(.+)$/i,
    /^\s*let\s([^\=]+)(be)(.+)(\<\=)(.+)$/i,
    /^\s*let\s([^\=]+)(be)(.+)\s(is greater than)\s(.+)$/i,
    /^\s*let\s([^\=]+)(be)(.+)\s(is less than)\s(.+)$/i,
    /^\s*let\s([^\=]+)(be)(.+)\s(is)\s(.+)$/i,
    /^\s*let\s([^\=]+)(be)(.+)\s(equals)\s(.+)$/i,

    // /^\s*initialize\s([^\=]+)(to)(.+)(\+)(.+)$/i,
    // /^\s*initialize\s([^\=]+)(to)(.+)\s(plus)\s(.+)$/i,
    // /^\s*initialize\s([^\=]+)(to)(.+)(\-)(.+)$/i,
    // /^\s*initialize\s([^\=]+)(to)(.+)\s(minus)\s(.+)$/i,
    // /^\s*initialize\s([^\=]+)(to)([^\*]+)([\*]+)(.+)$/i,
    // /^\s*initialize\s([^\=]+)(to)(.+)\s(by|of|times)\s(.+)$/i,
    // /^\s*initialize\s([^\=]+)(to)(.+)(\/)(.+)$/i,
    // /^\s*initialize\s([^\=]+)(to)(.+)(\%)(.+)$/i,
    // /^\s*initialize\s([^\=]+)(to)(.+)(\=\=)(.+)$/i,
    // /^\s*initialize\s([^\=]+)(to)(.+)\s(and)\s(.+)$/i,
    // /^\s*initialize\s([^\=]+)(to)(.+)\s(or)\s(.+)$/i,

    // /^\s*initialize\s([^\=]+)(\=)(.+)\s(is equal to)\s(.+)$/i,
    // /^\s*initialize\s([^\=]+)(\=)(.+)(\!\=)(.+)$/i,
    // /^\s*initialize\s([^\=]+)(\=)(.+)\s(is not equal to)\s(.+)$/i,
    // /^\s*initialize\s([^\=]+)(\=)(.+)\s(is not)\s(.+)$/i,
    // /^\s*initialize\s([^\=]+)(\=)(.+)(\>)(.+)$/i,
    // /^\s*initialize\s([^\=]+)(\=)(.+)(\<)(.+)$/i,
    // /^\s*initialize\s([^\=]+)(\=)(.+)\s(is greater than or equals)\s(.+)$/i,
    // /^\s*initialize\s([^\=]+)(\=)(.+)\s(is greater than or equal to)\s(.+)$/i,
    // /^\s*initialize\s([^\=]+)(\=)(.+)(\>\=)(.+)$/i,
    // /^\s*initialize\s([^\=]+)(\=)(.+)\s(is less than or equals)\s(.+)$/i,
    // /^\s*initialize\s([^\=]+)(\=)(.+)\s(is less than or equal to)\s(.+)$/i,
    // /^\s*initialize\s([^\=]+)(\=)(.+)(\<\=)(.+)$/i,
    // /^\s*initialize\s([^\=]+)(\=)(.+)\s(is greater than)\s(.+)$/i,
    // /^\s*initialize\s([^\=]+)(\=)(.+)\s(is less than)\s(.+)$/i,
    // /^\s*initialize\s([^\=]+)(\=)(.+)\s(is)\s(.+)$/i,
    // /^\s*initialize\s([^\=]+)(\=)(.+)\s(equals)\s(.+)$/i,

    // /^\s*initialize\s([^\=]+)(as)(.+)(\+)(.+)$/i,
    // /^\s*initialize\s([^\=]+)(as)(.+)\s(plus)\s(.+)$/i,
    // /^\s*initialize\s([^\=]+)(as)(.+)(\-)(.+)$/i,
    // /^\s*initialize\s([^\=]+)(as)(.+)\s(minus)\s(.+)$/i,
    // /^\s*initialize\s([^\=]+)(as)([^\*]+)([\*]+)(.+)$/i,
    // /^\s*initialize\s([^\=]+)(as)(.+)\s(by|of|times)\s(.+)$/i,
    // /^\s*initialize\s([^\=]+)(as)(.+)(\/)(.+)$/i,
    // /^\s*initialize\s([^\=]+)(as)(.+)(\%)(.+)$/i,
    // /^\s*initialize\s([^\=]+)(as)(.+)(\=\=)(.+)$/i,
    // /^\s*initialize\s([^\=]+)(as)(.+)\s(and)\s(.+)$/i,
    // /^\s*initialize\s([^\=]+)(as)(.+)\s(or)\s(.+)$/i,

    // /^\s*initialize\s([^\=]+)(as)(.+)\s(is equal to)\s(.+)$/i,
    // /^\s*initialize\s([^\=]+)(as)(.+)(\!\=)(.+)$/i,
    // /^\s*initialize\s([^\=]+)(as)(.+)\s(is not equal to)\s(.+)$/i,
    // /^\s*initialize\s([^\=]+)(as)(.+)\s(is not)\s(.+)$/i,
    // /^\s*initialize\s([^\=]+)(as)(.+)(\>)(.+)$/i,
    // /^\s*initialize\s([^\=]+)(as)(.+)(\<)(.+)$/i,
    // /^\s*initialize\s([^\=]+)(as)(.+)\s(is greater than or equals)\s(.+)$/i,
    // /^\s*initialize\s([^\=]+)(as)(.+)\s(is greater than or equal to)\s(.+)$/i,
    // /^\s*initialize\s([^\=]+)(as)(.+)(\>\=)(.+)$/i,
    // /^\s*initialize\s([^\=]+)(as)(.+)\s(is less than or equals)\s(.+)$/i,
    // /^\s*initialize\s([^\=]+)(as)(.+)\s(is less than or equal to)\s(.+)$/i,
    // /^\s*initialize\s([^\=]+)(as)(.+)(\<\=)(.+)$/i,
    // /^\s*initialize\s([^\=]+)(as)(.+)\s(is greater than)\s(.+)$/i,
    // /^\s*initialize\s([^\=]+)(as)(.+)\s(is less than)\s(.+)$/i,
    // /^\s*initialize\s([^\=]+)(as)(.+)\s(is)\s(.+)$/i,
    // /^\s*initialize\s([^\=]+)(as)(.+)\s(equals)\s(.+)$/i,

    /^\s*([^\=\+\-\*\/\%]+)(\+\=)(.+)$/i,
    /^\s*([^\=\+\-\*\/\%]+)(\-\=)(.+)$/i,
    /^\s*([^\=\+\-\*\/\%]+)(\*\=)(.+)$/i,
    /^\s*([^\=\+\-\*\/\%]+)(\/\=)(.+)$/i,
    /^\s*([^\=\+\-\*\/\%]+)(\%\=)(.+)$/i,
    /^\s*([^\=\+\-\*\/\%]+)(\*\*\=)(.+)$/i,
    /^\s*([^\=\+\-\*\/\%]+)(\=\=)(.+)$/i,

    /^\s*([^\=]+)(\=)(.+)(\+)(.+)$/i,
    /^\s*([^\=]+)(\=)(.+)\s(plus)\s(.+)$/i,
    /^\s*([^\=]+)(\=)(.+)(\-)(.+)$/i,
    /^\s*([^\=]+)(\=)(.+)\s(minus)\s(.+)$/i,
    /^\s*([^\=]+)(\=)([^\*]+)([\*]+)(.+)$/i,
    /^\s*([^\=]+)(\=)(.+)\s(by|of|times)\s(.+)$/i,
    /^\s*([^\=]+)(\=)(.+)(\/)(.+)$/i,
    /^\s*([^\=]+)(\=)(.+)(\%)(.+)$/i,
    /^\s*([^\=]+)(\=)(.+)(\=\=)(.+)$/i,
    /^\s*([^\=]+)(\=)(.+)\s(and)\s(.+)$/i,
    /^\s*([^\=]+)(\=)(.+)\s(or)\s(.+)$/i,

    /^\s*([^\=]+)(\=)(.+)\s(is equal to)\s(.+)$/i,
    /^\s*([^\=]+)(\=)(.+)(\!\=)(.+)$/i,
    /^\s*([^\=]+)(\=)(.+)\s(is not equal to)\s(.+)$/i,
    /^\s*([^\=]+)(\=)(.+)\s(is not)\s(.+)$/i,
    /^\s*([^\=]+)(\=)(.+)(\>)(.+)$/i,
    /^\s*([^\=]+)(\=)(.+)(\<)(.+)$/i,
    /^\s*([^\=]+)(\=)(.+)\s(is greater than or equals)\s(.+)$/i,
    /^\s*([^\=]+)(\=)(.+)\s(is greater than or equal to)\s(.+)$/i,
    /^\s*([^\=]+)(\=)(.+)(\>\=)(.+)$/i,
    /^\s*([^\=]+)(\=)(.+)\s(is less than or equals)\s(.+)$/i,
    /^\s*([^\=]+)(\=)(.+)\s(is less than or equal to)\s(.+)$/i,
    /^\s*([^\=]+)(\=)(.+)(\<\=)(.+)$/i,
    /^\s*([^\=]+)(\=)(.+)\s(is greater than)\s(.+)$/i,
    /^\s*([^\=]+)(\=)(.+)\s(is less than)\s(.+)$/i,
    /^\s*([^\=]+)(\=)(.+)\s(is)\s(.+)$/i,
    /^\s*([^\=]+)(\=)(.+)\s(equals)\s(.+)$/i,

    /^\s*set\s([^\=]+)(\=)([a-zA-Z0-9\s]+)$/i,
    /^\s*set\s([^\=]+)(to)([a-zA-Z0-9\s]+)$/i,
    /^\s*set\s([^\=]+)(as)([a-zA-Z0-9\s]+)$/i,
    /^\s*let\s([^\=]+)(\=)([a-zA-Z0-9\s]+)$/i,
    /^\s*let\s([^\=]+)(be)([a-zA-Z0-9\s]+)$/i,
    /^\s*initialize\s([^\=]+)(to)([a-zA-Z0-9\s]+)$/i,
    /^\s*initialize\s([^\=]+)(as)([a-zA-Z0-9\s]+)$/i,
    /^\s*([^\=\+\-\*\/\%]+)(\=)([a-zA-Z0-9\s]+)$/i,
  ]
};

const UserDefinitions = (definition) => {
    _SYMBOLS_['_USER_NAMES_'].push(definition);
}

module.exports = { 
    iterations_regexp: _SYMBOLS_['_ITERATIONS_'],
    assignments_regexp : _SYMBOLS_['_ASSIGNMENTS_'],
    conditionals_regexp : _SYMBOLS_['_CONDITIONALS_'],
    functions_regexp: _SYMBOLS_['_FUNCTIONS_'],
    variables_regexp : _SYMBOLS_['_VARIABLES_'],
    user_definitions : UserDefinitions,
    user_ids : _SYMBOLS_['_USER_NAMES_']
}