import aliases from '../_data/project-aliases.ts'

const normalizeProject = (project: string) => {
  project = project.toLowerCase()
  return Object.hasOwn(aliases, project) ? aliases[project] : project
}

export default normalizeProject
