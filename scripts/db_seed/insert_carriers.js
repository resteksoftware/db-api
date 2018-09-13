let carriers = require('../../tests/data/carriers')
let ctrl = require('../../controllers/carriers')

const seedCarriers = () => {
  return ctrl.saveAllCarriers(carriers)
    .then(resp => console.log(resp))
}

seedCarriers()

module.exports = seedCarriers
