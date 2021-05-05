const mongoose = require('mongoose')
const { ObjectID } = mongoose.Schema.Types

const submissionSchema = new mongoose.Schema(
	{
		typeTransport: {
			type: String
		},
		customer: {
			type: ObjectID,
			ref: 'Customer'
		},
		contact: {
			type: ObjectID,
			ref: 'Contact'
		},
		address: {
			source: {
				address: {
					type: String
				},
				city: {
					type: String
				},
				province: {
					type: String
				},
				country: {
					type: String
				},
				zip: {
					type: String
				},
				date: {
					type: Date
				}
			},
			destination: {
				address: {
					type: String
				},
				city: {
					type: String
				},
				province: {
					type: String
				},
				country: {
					type: String
				},
				zip: {
					type: String
				},
				date: {
					type: Date
				}
			},
			deadlinesState: {
				type: String
			}
		},
		requestedService: {
			requestedService: {
				type: String
			},
			typeService: {
				type: String
			},
			typeApplication: {
				type: String
			},
			incoterms: {
				type: String
			},
			typeShipment: {
				type: String
			},
			typeEquipment: {
				type: String
			}
		},
		goods: {
			transport: {
				type: String
			},
			commodity: {
				type: String
			},
			quantity: {
				type: Number
			},
			totalWeight: {
				weight: {
					type: Number
				},
				unit: {
					type: String
				}
			},
			dimension: {
				full: {
					type: String
				},
				lenght: {
					type: Number
				},
				width: {
					type: Number
				},
				height: {
					type: Number
				},
				unit: {
					type: String
				}
			},
			oversized: {
				type: Boolean,
				default: false
			},
			hazmat: {
				isHasmat: {
					type: Boolean,
					default: false
				},
				category: {
					type: String
				},
				un: {
					type: String
				},
				quantity: {
					type: Number
				},
				weight: {
					weight: {
						type: Number
					},
					unit: {
						type: String
					}
				}
			},
			//------- START international
			international: {
				overlaid: {
					type: Boolean,
					default: false
				},
				tailgateTruck: {
					type: Boolean,
					default: false
				},
				loadingDock: {
					type: Boolean,
					default: false
				},
				natureGoods: {
					type: String
				},
				cargoInsurance: {
					type: Boolean,
					default: false
				},
				hazardousMaterial: {
					type: Boolean,
					default: false
				},
				category: {
					type: String
				},
				totalValue: {
					type: Number
				}
			},
			//------- END international
			details: {
				type: String
			}
		},
		equipment: {
			transport: {
				type: String
			},
			trailer: {
				type: String
			},
			toile: {
				type: Boolean,
				default: false
			},
			details: {
				type: String
			}
		},
		postedBy: {
			type: ObjectID,
			ref: 'User'
		},
		status: {
			type: String
		}
	},
	{
		timestamps: {
			createdAt: true,
			updatedAt: true
		}
	}
)

mongoose.model('Submission', submissionSchema)
