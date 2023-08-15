import React from 'react';
import { useQuery, useMutation } from '@apollo/client'; // import the hooks
import {
  Container,
  Card,
  Button,
  Row,
  Col
} from 'react-bootstrap';

import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';
import { GET_ME } from '../utils/queries'; // import the GET_ME query
import { REMOVE_BOOK } from '../utils/mutations'; // import the REMOVE_BOOK mutation

const SavedBooks = () => {
  // use the useQuery hook to fetch user data
  const { loading, data, refetch } = useQuery(GET_ME); // add refetch here
  const [removeBook] = useMutation(REMOVE_BOOK); // use the useMutation hook

  // handle the deletion of a book
  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      // execute the REMOVE_BOOK mutation
      await removeBook({
        variables: { bookId }, // pass the input variables to the mutation
      });

      // refetch the user data after deletion
      refetch();

      // upon success, remove book's id from localStorage
      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  // show loading message while fetching data
  if (loading) {
    return <h2>Loading...</h2>;
  }

  const userData = data.me;

  return (
    <>
      <div fluid className="text-light bg-dark p-5">
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </div>
      <Container>
        <h2 className='pt-5'>
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        <Row>
          {userData.savedBooks.map((book) => {
            return (
              <Col md="4" key={book.bookId}>
                <Card border='dark'>
                  {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className='small'>Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                      Delete this Book!
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default SavedBooks;
