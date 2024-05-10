const HANDLEALL = '__HANDLE_ALL__'

const defaultColorScheme = ["#F28527", "#C7382C", "#3575B1", "#61B14E", "#EBC94F", "#45C1E8", "#9E66E4", "#E44CD5", "#A06235", "#B2ACA8"]
const defaultNodeTypeShapeScheme = ["circle", "square", "cross", "diamond", "triangle"]
const defaultNetworks: Set<string> = new Set(['les-mis', 'marieboucher'])
const defaultDatasets: Set<string> = new Set(['les-mis-nodes.csv', 'les-mis-links.csv', 'marieboucher.csv'])

export {
  HANDLEALL,
  defaultColorScheme,
  defaultNodeTypeShapeScheme,
  defaultNetworks,
  defaultDatasets
}