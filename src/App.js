import React, {useState, useEffect} from 'react';
import './App.css';
import { ChakraProvider, Container, Input, Text, Button, Box } from "@chakra-ui/react"
import { readGoogleAsCSV } from '@knight-lab/timelinejs/src/js/core/ConfigFactory';
import { Timeline } from '@knight-lab/timelinejs';
import { saveAs } from 'file-saver';


function App() {
  const [id, setId] = useState("");
  const [data, setData]=useState();
  const [raw, setRaw]=useState();

  let path=`https://docs.google.com/spreadsheets/d/${id}/pubhtml`;

  
  const generateJson=async(id)=>{
    try {
      let d=await readGoogleAsCSV(path, '');
      setData(d);
      const blob=new Blob([JSON.stringify(d)], {
        type: 'application/json'
      });
      setRaw(blob)
    } catch (error) {
      console.log(error)
      setData(null);

    }
  }

  useEffect(() => {
    if(id && data && path){
      const timeline=new Timeline('tl', path);
    }
    
  }, [id, path, data])
  
  return (
    <ChakraProvider>
      <Container>
        <Text mt="24">
          enter your google sheets id
        </Text>
        <form onSubmit={event=>{
          event.preventDefault();
          generateJson(id);
        }}>
          <Input mt="2" placeholder="sheetID"  value={id} onChange={(event)=>setId(event.target.value)}/>
          <Button mt="4" type="submit">generate json</Button>
          {data &&  <Button ml="8" mt="4" type="button" onClick={()=>saveAs(raw, "data.json")}>download</Button>}
        </form>
        
        
        
      </Container>
      <Box my={16}>
          <div id="tl"></div>
        </Box>
    </ChakraProvider>

  );
}

export default App;
