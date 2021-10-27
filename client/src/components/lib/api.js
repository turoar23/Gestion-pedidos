const SERVER_URL = 'http://localhost:3000';

export async function getAllActiveOrders() {
    const response = await fetch(`${SERVER_URL}/getActiveOrders`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Could not fetch orders.');
    }
  
    const transformedOrders = [];
  
    for (const key in data.result) {
      const quoteObj = {
        // id: data.result[key]._id,
        // data : data.result[key],
        ...data.result[key]
      };
  
      transformedOrders.push(quoteObj);
    }
  
    return transformedOrders;
  }


// export async function getAllQuotes() {
//   const response = await fetch(`${SERVER_URL}/quotes.json`);
//   const data = await response.json();

//   if (!response.ok) {
//     throw new Error(data.message || 'Could not fetch quotes.');
//   }

//   const transformedQuotes = [];

//   for (const key in data) {
//     const quoteObj = {
//       id: key,
//       ...data[key],
//     };

//     transformedQuotes.push(quoteObj);
//   }

//   return transformedQuotes;
// }

// export async function getSingleQuote(quoteId) {
//   const response = await fetch(`${SERVER_URL}/quotes/${quoteId}.json`);
//   const data = await response.json();

//   if (!response.ok) {
//     throw new Error(data.message || 'Could not fetch quote.');
//   }

//   const loadedQuote = {
//     id: quoteId,
//     ...data,
//   };

//   return loadedQuote;
// }

// export async function addQuote(quoteData) {
//   const response = await fetch(`${SERVER_URL}/quotes.json`, {
//     method: 'POST',
//     body: JSON.stringify(quoteData),
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   });
//   const data = await response.json();

//   if (!response.ok) {
//     throw new Error(data.message || 'Could not create quote.');
//   }

//   return null;
// }

// export async function addComment(requestData) {
//   const response = await fetch(`${SERVER_URL}/comments/${requestData.quoteId}.json`, {
//     method: 'POST',
//     body: JSON.stringify(requestData.commentData),
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   });
//   const data = await response.json();

//   if (!response.ok) {
//     throw new Error(data.message || 'Could not add comment.');
//   }

//   return { commentId: data.name };
// }

// export async function getAllComments(quoteId) {
//   const response = await fetch(`${SERVER_URL}/comments/${quoteId}.json`);

//   const data = await response.json();

//   if (!response.ok) {
//     throw new Error(data.message || 'Could not get comments.');
//   }

//   const transformedComments = [];

//   for (const key in data) {
//     const commentObj = {
//       id: key,
//       ...data[key],
//     };

//     transformedComments.push(commentObj);
//   }

//   return transformedComments;
// }
