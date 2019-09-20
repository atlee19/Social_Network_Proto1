from flask import Flask, render_template, jsonify
from flask_socketio import SocketIO, join_room, leave_room
from flask_sqlalchemy import SQLAlchemy
#from flask_marshmallow import Marshmallow
from marshmallow import fields
from marshmallow_sqlalchemy import ModelSchema


app = Flask(__name__, static_folder="../static/dist", template_folder="../static")
app.config['SECRET_KEY'] = 'battleship'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'
socketio = SocketIO(app)
db = SQLAlchemy(app)
#ma = Marshmallow(app)

class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    comments = db.relationship('Comment',backref='post_owner')
    likes = db.Column(db.Integer, nullable=True)

    def __repr__(self):
        return f"Post({self.id}, {self.content}), {self.comments}, {self.likes}"

class Comment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    comment = db.Column(db.Text, nullable=True)
    owner_id = db.Column(db.Integer, db.ForeignKey('post.id'))

    def __repr__(self):
        return f"Comment {self.comment}"

class CommentSchema(ModelSchema):
    class Meta:
        model = Comment

class PostSchema(ModelSchema):
    class Meta:
        model = Post
    comments = fields.Nested(CommentSchema, many=True)



def convert_to_json(post_to_convert): #Try comment to convert as Param here?
    post_schema = PostSchema()
    output = post_schema.dump(post_to_convert)
    return output

def convert_comment_to_json(comment_to_convert):
    comment_schema = CommentSchema()
    output = comment_schema.dump(comment_to_convert)
    return output

def convert_many_to_json():
    all_posts = Post.query.all()
    #jsonify the data then emit it
    post_schema = PostSchema(many=True)
    output = post_schema.dump(all_posts)
    return output

#analyze how this works later but this a catch_all method
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    #print('PINGED: ' + path) why is this all favicons
    return render_template("index.html")



@socketio.on('fetch-posts')
def handle_connect():
    print('REQ FOR POSTS!')
    json_data = convert_many_to_json()
    socketio.emit('load-posts', json_data, broadcast=True)
    print('posts sent.')

@socketio.on('New-Like')
def hande_new_like(data):
    print(data)

@socketio.on('new-comment')
def hande_new_comment(data):
    #print(data)
    postid = data['id']
    comment_to_add = data['comment']
    post = Post.query.get(postid)
    comment = Comment(comment=comment_to_add, post_owner=post)
    db.session.add(comment)
    db.session.commit()
    print('comment added')
    json_data=convert_comment_to_json(comment)
    #print(json_data)
    join_room(postid)
    #print("ROOM: {}".format(room))
    socketio.emit('update-comment', json_data , broadcast=True)
    print('sent update')

@socketio.on('join')
def join(data):
    join_room(data)
    socketio.emit('joined', data, broadcast=True, room=data)
    print('JOINED ROOM {}'.format(data))

@socketio.on('post-id')
def handle_postid(postid):
    req_post = Post.query.get(postid) #get post
    json_data = convert_to_json(req_post)   #convert to json
    #join_room(postid)   #join room
    #socketio.emit('joined-room', postid, room=postid)
    #print('joined room.')
    socketio.emit('load-post-page', json_data, broadcast=False) #might want to double check that broadcast

@socketio.on('new-post-data')
def handle_newdata(data):
    print(data)
    post = Post(content=data)
    db.session.add(post)
    db.session.commit()
    print('added to db')
    new_json_data = convert_to_json(post)
    socketio.emit('update', new_json_data, broadcast=True)


if __name__ == '__main__':
    socketio.run(app, debug=True, host='0.0.0.0')
