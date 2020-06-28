import React from 'react';
import { FlatList } from 'react-native';

const CommentListRow = ({
  data,
  ListEmptyComponent,
  renderItem
}) => (
  <FlatList
    data={data}
    vertical
    keyExtractor={item => item._id.toString() }
    ListEmptyComponent={ListEmptyComponent}
    renderItem={({ item }) => renderItem(item)}
  />
);

export default CommentListRow;
