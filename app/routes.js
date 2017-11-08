const db = require( '../config/database' );

module.exports = function( app ) {
	app.get( '/api/sightings', ( request, response, next ) => {
		db.query( 'SELECT * FROM sightings')
		  .then( res => response.json( res.rows ))
		  .catch( e => console.error( e.stack ));
	});

  app.get( '/api/sightings/:id', (request, response, next ) => {
    db.query( 'SELECT * FROM sightings WHERE id = $1', [ request.params.id ])
      .then( res => response.json( res.rows[0] ))
      .catch( e => console.error( e.stack ));
  });

  app.post( '/api/sightings', ( request, response, next ) => {
  	db.query( 'INSERT INTO sightings ( celebrity, stalker, date, location, comment ) VALUES ( $1, $2, $3, $4, $5 )', [ request.body.celebrity, request.body.stalker, request.body.date, request.body.location, request.body.comment ])
  	  .then( res => {
  	  	console.log( res.rows[0] );
  	  	response.json( res.rows[0] );
  	  })
  	  .catch( e => console.error( e.stack ));
  });

  app.put( '/api/sightings/:id', ( request, response, next ) => {
    db.query( 'SELECT * FROM sightings WHERE id = $1', [ request.params.id ])
      .then( res_select => {
        selected = res_select.rows[0];
        const dateIsUndefined = request.body.date === undefined;
        const queryString = `UPDATE sightings SET celebrity = $1, stalker = $2, location = $3, comment = $4${ dateIsUndefined ? ' WHERE id = $5' : ', date = $5 WHERE id = $6' }`;
        const queryParameters = [ request.body.celebrity || selected.celebrity, request.body.stalker || selected.stalker, request.body.location|| selected.location, request.body.comment || selected.comment ].concat( dateIsUndefined ? [ ] : [ request.body.date ]).concat([ request.params.id ]);
        db.query( queryString, queryParameters )
          .then( res_update => response.json( res_update.rows[0]))
          .catch( e_update => console.error( e_update.stack ));
        })
      .catch( e_select => console.error( e_select.stack ));
  });

  app.delete( '/api/sightings/:id', ( request, response, next ) => {
    db.query( 'DELETE FROM sightings WHERE id = $1', [ request.params.id ])
      .then( res => response.json( res ))
      .catch( e => console.error( e.stack ));
  });

};
