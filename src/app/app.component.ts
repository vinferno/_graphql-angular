import { Component } from '@angular/core';
import {Apollo, gql} from 'apollo-angular';
import { map, Observable } from 'rxjs';

const GET_TODOS= gql`
  {
    todos {
      id
      name
    }
  }
`;

const ADD_TODO = gql`
  mutation addTodo($name: String!, $description: String!) {
    addTodo(name: $name, description: $description) {
      id
      name
    }
  }`;


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'angular-graphql';
  todos: Observable<any>;
  constructor(private apollo: Apollo) {
    this.todos = this.apollo
    .watchQuery({
      query: GET_TODOS,
    })
    .valueChanges.pipe(map(result => result.data && result.data));
  }
  ngOnInit() {
    this.todos.subscribe(data => console.log(data, 'data'));

    setInterval(() => {
      this.apollo.mutate({
        mutation: ADD_TODO,
        variables: {
          name: 'test',
          description: 'test'
        }
      }).subscribe(data => {
        console.log(data, 'subscribed data');
      });
    }, 10000);
  }
}
