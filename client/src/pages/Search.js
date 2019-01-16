import React, { Component } from "react";
import DeleteBtn from "../components/DeleteBtn";
import Jumbotron from "../components/Jumbotron";
import API from "../utils/API";
import { Link } from "react-router-dom";
import { Col, Row, Container } from "../components/Grid";
import { List, ListItem } from "../components/List";
import { Input, TextArea, FormBtn } from "../components/Form";

class Books extends Component {
  state = {
    books: [],
    savedBooks: [],
    title: ""
  };

  componentDidMount() {
    this.loadBooks();
  }

  loadBooks = () => {
    API.getBooks()
      .then(res =>
        this.setState({ books: res.data, title: "", author: "", synopsis: "" })
      )
      .catch(err => console.log(err));
  };

  deleteBook = id => {
    API.deleteBook(id)
      .then(res => this.loadBooks())
      .catch(err => console.log(err));
  };

  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  handleFormSubmit = event => {
    event.preventDefault();
    API.searchBooks(this.state.title)
      .then((res) => {
        console.log(res.data.items);
        this.setState({
          books: res.data.items,
          title: ""
        });
      })
  }
  render() {
    return (
      <Container fluid>
        <Row>
          <Col size="md-6">

            <h1>Search for Books?</h1>
            <Row>
              <Col size="md-12">
                <form>
                  <Input
                    value={this.state.title}
                    onChange={this.handleInputChange}
                    name="title"
                    placeholder="Search!"
                  />
                  <FormBtn
                    disabled={!(this.state.title)}
                    onClick={this.handleFormSubmit}
                  >
                    Search For Books
              </FormBtn>
                </form>
              </Col>
            </Row>
            {this.state.books.length ? (
              <List>
                {this.state.books.map(book => (
                  <ListItem key={book.id}
                  >
                    <img alt={book.volumeInfo.title} src={book.volumeInfo.imageLinks.smallThumbnail}></img>
                    <a href={book.saleInfo.buyLink}
                      target="_blank" rel="noopener noreferrer">
                      <strong>
                        {book.volumeInfo.title} by {
                          book.volumeInfo.authors.length === 0 ? 
                          (book.volumeInfo.authors.map(authors => authors)) 
                          :
                          ([...book.volumeInfo.authors].map((author, count) => count < book.volumeInfo.authors.length - 1 ? [author, " & "] : [author]).reduce((author1, author2) => author1.concat(author2)))}
                      </strong>
                    </a>
                    <DeleteBtn onClick={() => this.deleteBook(book._id)} />
                  </ListItem>
                ))}
              </List>
            ) : (
                <h3>No Results to Display</h3>
              )}
          </Col>
          <Col size="md-6 sm-12">

            <h1>Books On My List</h1>

            {this.state.books.length ? (
              <List>
                {this.state.savedBooks.map(book => (
                  <ListItem key={book._id}>
                    <Link to={"/books/" + book._id}>
                      <strong>
                        {book.title} by {book.author}
                      </strong>
                    </Link>
                    <DeleteBtn onClick={() => this.deleteBook(book._id)} />
                  </ListItem>
                ))}
              </List>
            ) : (
                <h3>No Results to Display</h3>
              )}
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Books;
