/**
 * Created by iyobo on 2016-05-12.
 */

//Spreading it out to ease human-readability of input
var input = `
{
   "foo1": "bar1",
   "foo2": "bar2",
   "foo3": {
      "foo31": "bar31",
      "foo32": "bar32",
      "foo33": {
         "foo331": "bar331"
      }
   },
   "foo4":"bar4"
}
`

//minifying input
input = input.replace(/ |\n/g,'')
console.log("Input:", input)

function parseMyJson(input){
	var neststack=[]
	var output={}
	var activekey=""
	var activevalue=""

	//States...because state machines are dirty and smelly without them
	var states = new function(){
		this.IDLE=0
		this.OBJECT_BEGIN=1 //{
		this.OBJECT_END=2 //}
		this.COLLECTING_KEY=3 //" + !assigning
		this.COLLECTING_VALUE=4  //" + assigning
		this.ASSIGNING=6 // :
		this.NEXT_KVP=7 // ,
		this.NEST_NEW_OBJECT=8
	}()

	var recursiveParse =function (str,index,state,out){
		switch(state){
			case states.IDLE:
				if(str[index]==='{'){
					recursiveParse(str, index+1, states.OBJECT_BEGIN,out)
				}
				break;
			case states.OBJECT_BEGIN:
				if(str[index]==='"'){
					recursiveParse(str, index+1, states.COLLECTING_KEY,out)
				}
				break;
			case states.OBJECT_END:
				out = output
				neststack.pop()

				for(nest in neststack){
					out= output[neststack[nest]]
				}

				recursiveParse(str, index+1, states.NEXT_KVP,out)
				break;
			case states.COLLECTING_KEY:
				activekey=""
				while(str[index]!='"'){
					activekey += str[index]
					index++
				}
				out[activekey]={}
				recursiveParse(str, index+1, states.ASSIGNING,out)

				break;
			case states.ASSIGNING:
				if(str[index]==':'){
					index++

					if(str[index]==='{'){
						//new nested object
						recursiveParse(str,index, states.NEST_NEW_OBJECT,out)
					}
					else if(str[index]=='"'){
						recursiveParse(str,index+1, states.COLLECTING_VALUE,out)
					}
				}

				break;
			case states.NEST_NEW_OBJECT:
				neststack.push(activekey)
				recursiveParse(str,index+1, states.OBJECT_BEGIN,out[activekey])

				break;
			case states.COLLECTING_VALUE:
				activevalue=""

				while(str[index]!='"'){
					activevalue += str[index]
					index++
				}
				out[activekey]=activevalue

				recursiveParse(str,index+1, states.NEXT_KVP,out)

				break;
			case states.NEXT_KVP:
				if(str[index]==','){
					recursiveParse(str,index+2, states.COLLECTING_KEY,out)
				}
				else if (str[index]=='}'){
					recursiveParse(str,index, states.OBJECT_END,out)
				}

				break;
		}
	}
	recursiveParse(input,0,states.IDLE,output)

	return output;
}

console.log("\nOutput:\n",parseMyJson(input))
