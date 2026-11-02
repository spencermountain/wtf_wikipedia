import aliases from '../world/data/projects.ts'

const normalizeProject = (project: string) => {
  project = project.toLowerCase()
  return Object.hasOwn(aliases, project) ? aliases[project] : project
}

export default normalizeProject
