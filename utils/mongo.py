class MongoMixin(object):
    '''Contains various querying methods, useful for mongodb.'''

    @classmethod
    def NO_INHERIT(cls):
        """
            This is basically a constant, but I want copy semantics instead of
            reference semantics on it, so I'm making it a function instead of
            imposing a .copy() on every caller (then one forgets and sets a
            shard key or something in the meta for every single other object)
        """
        return { 'allow_inheritance': False }


    @classmethod
    def YES_INHERIT(cls):
        """
            This is basically a constant, but I want copy semantics instead of
            reference semantics on it, so I'm making it a function instead of
            imposing a .copy() on every caller (then one forgets and sets a
            shard key or something in the meta for every single other object)
        """
        return { 'allow_inheritance': True }
