import React, { useState } from 'react';
import { forwardRef } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import AddBoxIcon from '@material-ui/icons/AddBox';
import TimelineIcon from '@material-ui/icons/Timeline';
import ListIcon from '@material-ui/icons/List';
import Button from '@material-ui/core/Button';
import MaterialTable from "material-table";
import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
  },
}));

const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};

export default function Dashboard() {
  const classes = useStyles();

  const [ selectedMenu, setSelectedMenu ] = useState( { menu: 'addform' } )
  const [ rawData, setRawData ] = useState( [] )
  const [ formRawdata, setFormRawdata ] = useState( '' )
  const [ formTitle, setFormTitle ] = useState( '' )
  const [ analyzedResult, setAnalyzedResult ] = useState( [] )
  
  function addData(){
    const newRawData = rawData.slice()

    let added = []

    // rawdataを行で分割
    const rows = formRawdata.split("\n")

    let lineNumber = 0
    rows.forEach( el => {
      let numbers = []
      let message
      let result

      const cols = el.split("\t")

      if( cols[0] || cols[1] || cols[2] ){
        if( cols[0] && cols[1] ){
          if( isNaN( cols[0] ) || isNaN( cols[1] ) ){
            message = '数字ではない'
            result = 'alert'
          }else if( cols[1] > cols[0] ){
            for( let i = cols[0]; i <= cols[1] ; i++ ){
              numbers.push( i )
            }
          }else{
            message = '最初の数字が大きい'
            result = 'alert'
          }
        }

        if( cols[2] ){
          const tmp =cols[2].split(",")
          tmp.forEach( n => {
            if( isNaN( n ) ){
              message = 'singlesが数字ではない'
              result = 'alert'
            }else{
              numbers.push( n )
            }
          })

        }
        added.push( { idx: lineNumber,
                      begin: cols[0],
                      end: cols[1],
                      singles: cols[2],
                      numbers: numbers,
                      message: message,
                      result: result }
                  )
      }else{
        added.push( { lineNumber: lineNumber, begin: null, end: null, singles: null, numbers: [], message: 'null', result: 'info'} )
      }

      lineNumber++
    })

    newRawData.push( { title: formTitle, rawdata : added } )

    const setIndex = newRawData.length - 1
    setRawData( newRawData )
    setSelectedMenu( { menu: 'viewdata', index: setIndex })
    setFormTitle('')
    setFormRawdata('')
    doAnalyze( added, formTitle, setIndex )
  }

  function doAnalyze( addedData, title, setIndex ){

    let newResult = analyzedResult.slice()

    let localCount = []

    for( let i = 0; i <= addedData.length ; i++ ){
      const obj = addedData[ i ]

      if( obj ){
        obj.numbers.forEach( num => {
          let message
          
          if( typeof( localCount[ num ] ) === 'undefined' ){
            localCount[ num ] = 1
            message = '[' + title + ']で出現' 
          }else{
            localCount[ num ] = localCount[ num ] + 1 
            message = '[' + title + ']で'  + localCount[ num ] + '回出現' 
          }

          if( newResult[ num ] ){
            //            console.log( 'already added' + num )
            newResult[ num ].count = newResult[ num ].count + 1
            newResult[ num ].sets.push( setIndex )
            newResult[ num ].messages[ setIndex ] = message
          }else{
            //            console.log('not yet. add ' + num )
            let messages = []
            messages[ setIndex ] = message
            newResult[ num ] = { number: num,
                                 count: 1,
                                 sets: [ setIndex ],
                                 messages: messages
                               }
          }
        })
      }
    }
    
    setAnalyzedResult( newResult )
  }


  function analysisContent(){

    const data = analyzedResult.filter( function( el, index, obj ) {
      return( el.count > 1 )
    }).map( ( obj, idx ) => {
      return {
        number: obj.number,
        count: obj.count,
        messages: obj.messages.join( ", " )
      }
    })

    return(
      <div title='doubles'>
        <MaterialTable
          icons={tableIcons}
          title="重複検査"
          columns = {[
            { title: 'チケット番号', field:'number', type:'numeric'},
            { title: '出現回数', field:'count'},
            { title: '出現箇所', field:'messages'},
          ]}
          data={ data }
        />
      </div>
    )
  }


  function changeFormTitle( e ){
    setFormTitle( e.target.value )
  }

  function changeFormRawdata( e ){
    setFormRawdata( e.target.value )
  }

  function addformContent(){
    return (
      <div data-testid='addform'>

        <TextField
          required
          role='title'
          id="standard-full-width"
          label="データの識別名(例: xx観光10月分)"
          style={{ margin: 8 }}
          placeholder="タイトル"
          fullWidth
          variant='outlined'
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
          value={ formTitle }
          onChange={ changeFormTitle.bind(this) }
        />

        <TextField
          role='rawdata'
          id="standard-full-width"
          label="チケットデータ"
          style={{ margin: 8 }}
          placeholder="最初の数字[tab]最後の数字[tab]連番でない数字1,連番でない数字2,...."
          fullWidth
          margin="normal"
          multiline={true}
          variant='outlined'
          rows="10"
          value={ formRawdata }
          onChange={ changeFormRawdata.bind( this ) }
        />

        <Button variant="contained" color="primary" role='adddata' onClick={ () => addData() }>
          登録
        </Button>

      </div>
    )
  }

  function RegisteredListItem( props ){
    const title='data-' + props.idx
    return (
      <ListItem button title={title} onClick={ () => setSelectedMenu( { menu: 'viewdata', index: props.idx } ) }>
        <ListItemIcon><ListIcon /></ListItemIcon>
        <ListItemText primary={props.item.title} />
      </ListItem>
    )
  }

  function viewContent(){
    const data = rawData[ selectedMenu.index ]

    let tableData = []

    for( let i = 0; i <= data.rawdata.length ; i++ ){
      if( data.rawdata[i] ){

        tableData.push( {
          idx: data.rawdata[i].idx,
          begin: data.rawdata[i].begin,
          end: data.rawdata[i].end,
          singles: data.rawdata[i].singles,
          numbers: data.rawdata[i].numbers.join(", "),
          message: data.rawdata[i].message,
        } )
      }
    }

    return(
      <div title='dataview'>
        <MaterialTable
          icons={tableIcons}
          title={data.title}
          columns = {[
            { title: 'LineNO', field:'idx', type:'numeric'},
            { title: '開始番号', field:'begin', type:'numeric'},
            { title: '終了番号', field:'end', type:'numeric'},
            { title: '飛び番号', field:'singles'},
            { title: '利用番号', field:'numbers'},
            { title: '--', field:'message'},
          ]}
          data={ tableData }
        />
      </div>
    )
  }


  let mainContent
  if( selectedMenu.menu === 'addform' ){
    mainContent = addformContent()
  }else if( selectedMenu.menu === 'analysis' ){
    mainContent = analysisContent()
  }else{
    mainContent = viewContent()
  }

  let savedMenu;
  savedMenu = rawData.map( ( item, index ) => {
    return(
      <RegisteredListItem key={ index } item={ item } idx={ index } />
    )
  })



  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="absolute" className={clsx(classes.appBar)}>
        <Toolbar className={classes.toolbar}>
          <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.formTitle}>
            チケット番号解析プログラム
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <Toolbar />
        <div className={classes.drawerContainer}>
          <List>
            <ListItem button key="addData" onClick={ () => setSelectedMenu({ menu: 'addform' }) }>
              <ListItemIcon><AddBoxIcon /></ListItemIcon>
              <ListItemText primary="データを追加" />
            </ListItem>
            <ListItem button key="seeAnalysis" onClick={ () => setSelectedMenu( { menu: 'analysis' }) }>
              <ListItemIcon><TimelineIcon /></ListItemIcon>
              <ListItemText primary="分析結果" />
            </ListItem>
          </List>
          <Divider />
          <List role="savedMenuItem">
            {savedMenu}
          </List>
        </div>
      </Drawer>

      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          {mainContent}
        </Container>
      </main>
    </div>
  );
}
