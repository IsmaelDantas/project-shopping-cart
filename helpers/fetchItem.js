const fetchItem = async (itemID) => {
  const url = await `https://api.mercadolibre.com/items/${itemID}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log('You must provide an url', error);
  }
};

if (typeof module !== 'undefined') {
  module.exports = {
    fetchItem,
  };
}