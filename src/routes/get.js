const get = async (req, res) => {
  try {
    // Get the database address from the request
    const address = req.params[0]

    // Get params on how we should output the results
    const shouldStream = req.query.live || false

    // Set the limit on how many entries we should return in the result
    const limit = req.query.limit || -1
	
	const body = JSON.parse(req.body)
	

    // Open the requested database
    const db = await req.orbitdb.open(address, {
      create: false,
      sync: true,
      localOnly: req.query.live ? !req.query.live : true,
    })

    // Load the database
    await db.load()


	var data = '';
    if(body.fetchType == "byId"){
	
	    data = db.get(body._id)
		
	}else if(body.fetchType == "bySignature"){	
	
		data = db.query((doc) => doc.signature == body._id)
	
	}else if(body.fetchType == "byCategory"){
	
		data = db.query((doc) => doc.category == body._id)
				.filter(d => d.stock > 0)
		
	}else if(body.fetchType == "byTerm"){
	
		data = db.query((doc) => doc.stock > 0)
				.filter(function(item){ return item.product.indexOf ( body.term )> -1; });
	}
	
	

    // Loop if we're streaming the results
    if (shouldStream) {
      const queryAndRespond = () => {
        res.write(JSON.stringify({
          result: data
        }))
      }
      db.events.on('replicated', queryAndRespond)
      db.events.on('write', queryAndRespond)
      res.on('end', () => console.log("FINISHED!"))
      queryAndRespond()
    } else {
      // Return the results
      res.send({
        result: data
      })
    }
  } catch (e) {
    // TODO: return 404 if the database doesn't exist
    res.status(500).send({ error: e.toString() })
  }
}

module.exports = get
