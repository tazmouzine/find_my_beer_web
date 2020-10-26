import Api from './api';

const EstablishmentsService = {
  show: (place_id) => Api.get(`/google_stores/${place_id}`),
  index: (latitude, longitude) => Api.get(`/google_stores?latitude=${latitude}&longitude=${longitude}`)  
}

export default EstablishmentsService;