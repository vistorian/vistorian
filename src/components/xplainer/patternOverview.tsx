import { Collapse, Switch } from "antd"
import type { CollapseProps } from 'antd';
import { AllMotifs } from "../../../typings"
import { patternList } from "./patternList";

interface Props {
  motifs: AllMotifs
  checked: boolean
  setChecked: (b: boolean) => void
}

function PatternOverview(props: Props) {

  const getTetxt = (name: string) => {
    if (name in patternList) {
      return patternList[name].description
    }
    else return ''
  }

  const getPanel = (name: string, cnt: number) => {
    return (
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <div style={{display: 'flex', alignItems: 'center'}}>
          <img 
            src={`./pattern-icons/nodelink/${name}.svg`}
            style={{width: 30, height: 30, marginRight: 8, border: '1px solid #535353', borderRadius: 4}} />
          <span>{patternList[name].title}</span>
        </div>
        <span>{cnt}</span>
      </div>
    )
  }

  const getItems = () => {
    const items = Object.keys(props.motifs).map((motif, index) => {
      return ({
        key: index,
        label: getPanel(motif, props.motifs[motif].length),
        children: <p>{getTetxt(motif)}</p>
      })
    }) as CollapseProps['items']
    return items
  }

  return (
    <div>
      <p style={{ fontSize: 18, display: 'flex', justifyContent: 'space-between' }}>
        <b>Pattern Overview:</b>
        <Switch size='small' checked={props.checked} onChange={()=> props.setChecked(!props.checked)} />
      </p>
      {(props.motifs && Object.keys(props.motifs).length > 0) ? 
        <Collapse
          items={getItems()}
          bordered={false}
          defaultActiveKey={[0]}
        /> : null}
    </div>
  )
}

export default PatternOverview