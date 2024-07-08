import hashlib

def encriptarMD5(passw):
    passw_bytes = passw.encode('utf-8')
    hash_md5 = hashlib.md5()
    hash_md5.update(passw_bytes)
    passw_encriptada = hash_md5.hexdigest()
    return passw_encriptada