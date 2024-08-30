import * as React from 'react';
import ButtonVis from "./buttonCreateStory";
import {Col, Layout, Row} from 'antd';
import {createUseStyles} from "react-jss";

const useStyles = createUseStyles({
    root: {
        display: 'flex',
        flexDirection: 'column',
        // justifyContent: 'space-between',
        alignItems: 'center',
        // color: '#222',
        background:'#FCF3E6',
        width:'100%',
        height:'100%'
    },
    logo: {
        paddingTop: 20,
        width: 250
    },
    subtitle: {
        marginBottom: 20,
        fontSize: '18pt',
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
        flexWrap: 'wrap',
        maxWidth: '1200px',
    },
    divMenu:{
        display: 'inline-block',
    },
    subDiv:{
        display: 'flex',
        fontWeight: '10',
        textAlign: 'left'
    },
    h2:{
        fontSize: '30pt',
        fontWeight: '900',
        color: '#333',
        lineHeight: '1.5em',
        fontFamily: `'Poiret One', 'Helvetica Neue', 'sans-serif'`,
        paddingTop: "15px"
    },
    logoDiv:{
        '& img':{
            height: '50px',
            padding: '20px',
        }
    },
    visImg: {
        border: "solid 1px #eee",
        height: "180px",
        width: "300px",
        boxShadow: "5px 5px 10px #ddd",
        marginLeft: "5px",
        marginRight: "5px",
        borderRadius: "10%",
    }
})

function LandingPage() {
    const classes = useStyles()
    return (

        <div className={classes.root}>

            <b><h2 className={classes.h2}>The Vistorian Story Editor </h2></b>
            <div className={classes.subtitle}> Share your interactive network visualization story. </div>
            <br />
            <div id="vistiles" className="visTiles-0-1-4"
                 style={{
                     display: "flex",
                     flexWrap: "wrap",
                     maxWidth: "1200px",
                     marginBottom: "50px",
                     flexDirection: "row",
                     justifyContent: "center",
                     // marginLeft: '10%'
                 }}
            >

                <img src="/images/LandingText.png" alt="Node Link" className={classes.visImg}/>
                <img src="/images/SearchMarie.png" alt="Node Link" className={classes.visImg}/>
                <img src="/images/Landing1.png" alt="Node Link" className={classes.visImg}/>

            </div>


            <Row>
                <Col span={24} type="flex" align="middle">
                        <ButtonVis />
                    </Col>
                </Row>
        </div>
)
}
export default LandingPage
