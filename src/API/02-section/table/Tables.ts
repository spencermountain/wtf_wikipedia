import Table from './Table.ts'
import { WrapperArray, wrapMethods } from '../../../_lib/plural-wrapper.ts'

class Tables extends WrapperArray<Table> {}
wrapMethods(Tables, Table)

export default Tables
