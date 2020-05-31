// Full Documentation - https://docs.turbo360.co
const turbo = require('turbo360')({ site_id: process.env.TURBO_APP_ID })
const vertex = require('vertex360')({ site_id: process.env.TURBO_APP_ID })
const router = vertex.router()

const Profile = require('../models/Profile')

/*  This is a sample API route. */

router.get('/profile', (req, res) => {
	// res.json(req.query )
	Profile.find()
		.then(profiles => {
			res.end(`${JSON.stringify({ confirmation: 'success', data: profiles }, null, "   ")}`)
		})
		.catch(err => {
			res.json({
				confirmation: 'fail',
				data: err.message
			})
		})
})

router.get('/profile/update', (req, res) => {
query = req.query
	if (!req.query.id) res.json({ confirmation: 'fail', data: 'Provide an Id to update' });
// delete query.id
	Profile.findByIdAndUpdate(req.query.id, query, { new: true }) 
		.then(profile => {
			res.end(`${JSON.stringify({ confirmation: 'success', data: profile }, null, "   ")}`)
		})
		.catch(err => {
			res.json({
				confirmation: 'fail',
				data: err.message
			})
		})
})

router.get('/profile/:id', (req, res) => {
	Profile.findById(req.params.id)
		.then(profiles => {
			res.end(`${JSON.stringify({ confirmation: 'success', data: profiles }, null, "   ")}`)
		})
		.catch(err => {
			res.json({
				confirmation: 'fail',
				data: err.message
			})
		})
})

router.post('/profile', (req, res) => {
	// res.json(req.body)
	Profile.create(req.body)
		.then(profile => {
			res.end(`${JSON.stringify({ confirmation: 'success', data: profile }, null, "   ")}`)
		})
		.catch(err => {
			res.json({
				confirmation: 'fail',
				data: err.message
			})
		})
})

router.delete('/profile', (req, res) => {
	// res.json(req.query)
	Profile.findByIdAndDelete(req.query.id)
		.then(profile => {
			res.end(`${JSON.stringify({ confirmation: 'success', data: profile }, null, "   ")}`)
		})
		.catch(err => {
			res.json({
				confirmation: 'fail',
				data: err.message
			})
		})
})

router.get('/:resource', (req, res) => {
	res.json({
		confirmation: 'success',
		resource: req.params.resource,
		query: req.query // from the url query string
	})
})

router.get('/:resource/:id', (req, res) => {
	res.json({
		confirmation: 'success',
		resource: req.params.resource,
		id: req.params.id,
		query: req.query // from the url query string
	})
})



module.exports = router
