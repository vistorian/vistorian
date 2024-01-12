import { createUseStyles } from 'react-jss'
import { Button } from 'antd'
import templates from '../templates/templates'
import { Template } from '../../../typings'

const useStyles = createUseStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: '#222'
  },
  logo: {
    paddingTop: 40,
    width: 350
  },
  subtitle: {
    marginBottom: 30,
    fontSize: '20pt',
    color: '#111111',
    lineHeight: '1.5em',
    textAlign: 'center',
    fontFamily: `'Poiret One', 'Helvetica Neue', 'sans-serif'`,
  },
  visTiles: {
    marginBottom: 50,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap'
  },
  visimage: {
    height: 200,
    border: 'solid 1px #eee',
    marginRight: 5,
    marginLeft: 5
  },
  startButton:{
    fontSize: '23pt',
    fontWeight: 'bold',
    color: '#fff',
    textDecoration: 'none',
    fontFamily: `'Poiret One', 'Helvetica Neue', 'sans-serif'`,
    height: '60px',
    background: '#999'
  }, 
  divMenu:{
    display: 'inline-block',
  },
  subDiv:{
    display: 'flex',
    textAlign: 'left'
  },
  h2:{
    fontSize: '23pt',
    fontWeight: '300',
    color: '#333',    
    fontFamily: `'Poiret One', 'Helvetica Neue', 'sans-serif'`,
  },
  menuCol: {
		paddingRight: '40px',
		paddingLeft: '40px',
	},
	menuColH2: {
		marginBottom: '20px'
	},
	divCitation: {
		width: '600px',
		textAlign: 'left',
		margin: 'auto'
	},
  footer: {
		paddingBottom: '100px'
	},
	citationBibtex: {
		// fontSize: '80%',
		textAlign: 'left',
		maxWidth: '100%',
		overflowX: 'auto',
		height: 'fit-content',
		marginLeft: 'auto',
		marginRight: 'auto',
		padding: '20px',
		background: '#f3f3f3',
		color: '#636363',
	}, 
  logoDiv:{
    '& img':{
      height: '50px',
      padding: '20px'
    }
  }
})

const bibTexCitation =  `@misc{bach:hal-01205822,
    TITLE = {{NetworkCube: Bringing Dynamic Network Visualizations to Domain Scientists}},
    AUTHOR = {Bach, Benjamin and Henry Riche, Nathalie and Fernandez, Roland and Giannisakis, Emmanoulis and Lee, Bongshin and Fekete, Jean-Daniel},
    URL = {https://hal.inria.fr/hal-01205822},
    NOTE = {Poster},
    HOWPUBLISHED = {{Posters of the Conference on Information Visualization (InfoVis)}},
    YEAR = {2015},
    MONTH = Oct
}`;

function Landing() {
  const classes = useStyles()

  // const examples: string[] = ['nodelink', 'matrix', 'timearcs', 'map']

  return (
    <div className={classes.root}>
      <img src="./logos/logo-vistorian.png" className ={classes.logo}/>

      <p className={classes.subtitle}>Interactive Visualizations for Dynamic and Multivariate Networks. <br />  Free, online, and open source.</p>

      <div id="vistiles" className={classes.visTiles}>
        {templates.map((template: Template) => (
          // TODO: add rooute link
          <a href='./' key={template.key}>
            <img src={`./thumbnails/${template.image}`} className={classes.visimage}/>
          </a>
        ))}
      </div>

      <Button className={classes.startButton} href='#/wizard'>Visualize you data</Button>
      <br></br>
     
      <div id="divMenu" className={classes.divMenu}>

				<div className={classes.subDiv}>
					<div className={classes.menuCol}>
						<h2 className={classes.h2}>Overview</h2>
						<a href="https://vistorian.github.io">Project</a>
						<br />
						<a href="https://vistorian.github.io/visualizations.html">Visualizations</a>
						<br />
						<a href="https://vistorian.github.io/formattingdata.html">Formatting Data</a>
						<br />
						<a href="https://vistorian.github.io/networknarratives.html">NetworkNarratives</a>
					</div>

					<div className={classes.menuCol}>
						<h2 className={classes.h2}>Learn</h2>
						<a href="https://vistorian.github.io/gettingstarted.html">Getting Started</a>
						<br />
						<a href="https://vistorian.github.io/courses.html">Courses</a>
						<br />
						<a href="https://vistorian.github.io/tutorials.html">Workshops</a>
						<br />
						<a href="https://vistorian.github.io/Troubleshooting.html">Troubleshooting</a>
						<br />
						<a href="https://vistorian.github.io/Resources.html">Network Resources</a>
					</div>

					<div className={classes.menuCol}>
						<h2 className={classes.h2}>Context</h2>
						<a href="https://vistorian.github.io/vistorianLab.html">Research &amp; VistorianLab</a>
						<br />
						<a href="https://vistorian.github.io/publications.html">Publications</a>
						<br />
						<a href="https://vistorian.github.io/development.html">Contribute</a>
						<br />
						<a href="https://vistorian.github.io/team.html">Team</a>
						<br />
						<a href="mailto: vistorian@inria.fr">Contact</a>
					</div>
				</div>
			</div>
			
      <div className={classes.divCitation}>
        <h2 className={classes.h2}>What is the Vistorian?</h2>
          <p>The Vistorian is an online tool for interactive exploration of dynamic, multivariate, and geographic networks. 
            Though we are a web application, any data you 'upload' stays is stored in your browser. 
            Clearing your browser cache will delete your data. 
          </p>

          <p>Main features include:
            <ul>
              <li>A wide range of different interactive network visualizations: node link diagrams</li>
              <li>Side-by-side view and parallel use of any of these visualizations.</li>
              <li>A geocoding service that obtains geographic locations from placenames in your dataset.</li>
            </ul>
          </p>
          <p>The Vistorian is an active research project at the Vishub at the University of Edinburgh and Inria, France. The Vistorian is free to use by everyone. If you’re using the Vistorian for work, please cite our poster and send us feedback and examples of your work of our gallery. This helps us keeping the Vistorian funded. Similarly, if you find bugs, send us screenshots and descriptions, we’re happy to help you with your data. The Vistorian is open source.</p>
      </div>


			<div className={classes.divCitation}>

				<h2 className={classes.h2}>Support us by citing</h2>
				<p>
					Benjamin Bach, Nathalie Henry Riche, Roland Fernandez, Emmanoulis Giannisakis, Bongshin
					Lee, Jean-Daniel Fekete.
					<a href="https://hal.inria.fr/hal-01205822/document"
						>NetworkCube: Bringing Dynamic Network Visualizations to Domain Scientists</a
					>. Posters of the Conference on Information Visualization (InfoVis), Oct 2015, Chicago,
					United States. 2015.
				</p>

        <a href="https://hal.inria.fr/hal-01205822/document">Read the paper here</a>
				<pre className={classes.citationBibtex}>{bibTexCitation}</pre>

      <h2 className={classes.h2}>Contribute</h2> 
      
      Vistorian and the underlying library, NetPanorama are open source. To get involved, visit
      <ul>
        <li><a href="https://github.com/vistorian/vistorian">https://github.com/vistorian/vistorian</a></li>
        <li><a href="https://github.com/NetPanorama/NetPanorama">https://github.com/NetPanorama/NetPanorama</a></li>
      </ul>
      <a href="mailto:benj.bach@gmail.com">e-mail us</a>.
		</div>
 
    <div className={classes.logoDiv}>
      <br/><br/>
      <a href="http://vishub.net"><img src="logos/logo-vishub.png" /></a>
      <a href="http://www.ed.ac.uk/informatics"><img id="uoe" src="logos/logo-edinburgh.png" /></a>
      <a href="http://www.inria.fr"><img src="logos/logo-inria.png" /></a>
      <a href="http://www.msr-inria.fr/"><img src="logos/logo-msr.png" /></a>
    </div>
 
    </div>
  )
}

export default Landing